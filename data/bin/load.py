#!/usr/local/bin/python3
"""A script to load FHIR resources into an open FHIR server.

Useage:
  load.py --data <folder> [--server <server_base>] [--tag id] [--delete-all]
    --data <folder> - a folder containing synthea fhir output json bundles
    --server <base> - a FHIR server base URL to PUT all data into
    --tag id - a string to tag all loaded resources with
    --delete-all - delete all resources matching the tag

TODO:
  [ ] implement delete-all
  [ ] enable bearer token authentication
  [ ] make --server mandatory?

"""
import glob
import json
import os
import pprint
import socket
from urllib.parse import urlparse

import click  # pip3 install click
import requests  # pip3 install requests

RESOURCE_TAG = '|'.join([
    'http://hl7.org/Connectathon',
    '2020-Sep',
])
TEST_SERVER = 'http://localhost:8080/hapi-fhir-jpaserver/fhir'


class Error(Exception):
    pass


class EntryTagger:
    """Injects a meta tag into bundle entries before they are loaded."""
    def __init__(self, tag_query, tags=None):
        self._query = tag_query.strip()
        if not tags:
            system, code = f'{tag_query}|'.split('|', 1)
            tags = [{'system': system, 'code': code.strip('|')}]
        self._tags = tags

    def tag(self, entries):
        """Yields entries that include a custom tag."""
        for entry in entries:
            if self._query:
                entry['resource'].setdefault('meta', {})['tag'] = self._tags
            yield entry


class EntryReferenceUpdater:
    """Updates references to use an ID and creates Resources conditionally."""

    _id_type = {}
    _identifier = 'https://github.com/synthetichealth/synthea'
    _no_identifier_types = [
        'Provenance',
    ]

    def collect_ids(self, entries):
        """Updates the collection mapping uuid to resourceType for each entry.

        Param:
        entries: list of Resources, each with at least 'id' and 'resourceType'
        """
        self._id_type.update({
            e['resource']['id']: e['resource']['resourceType'] for e in entries
        })

    def update_identifier(self, resource):
        """Updates a resource identifier to include the synthea ID, if missing.

        Param:
          resource: a FHIR Resource dict.
        """
        if resource['resourceType'] in self._no_identifier_types:
            return
        uuid = resource['id']
        synthea_id = {
            'system': self._identifier,
            'value': uuid,
        }
        resource.setdefault('identifier', [synthea_id])
        if not [x for x in resource['identifier'] if x.get('value') == uuid]:
            resource['identifier'].append(synthea_id)

    def update_references(self, resource):
        """Recursively updates all references in a Resource to be conditional.

        See Conditional References: https://www.hl7.org/fhir/http.html#trules

        Param:
          resource: a FHIR Resource dict.
        """
        if resource.__class__.__name__ != 'dict':
            return
        for key, value in resource.items():
            if key == 'reference' and value.startswith('urn:uuid:'):
                uuid = value.split(':')[-1]
                if uuid in self._id_type:
                    resource[key] = f"{self._id_type[uuid]}?identifier={uuid}"
            elif value.__class__.__name__ == 'dict':
                self.update_references(value)  # Recurse!
            elif value.__class__.__name__ == 'list':
                for r in value:
                    self.update_references(r)  # Recurse!

    def update_request(self, entry):
        """Updates a transaction bundle's request to include ifNoneExist.

        Param:
          entry: a FHIR bundle Entry dict.
        """
        if 'identifier' in entry['resource']:
            entry['request'].setdefault(
                'ifNoneExist',
                f"identifier={self._identifier}|{entry['resource']['id']}",
            )

    def update(self, entries):
        self.collect_ids(entries)
        for entry in entries:
            self.update_identifier(entry['resource'])
            self.update_request(entry)
            self.update_references(entry['resource'])


class Server:
    """A FHIR Server to receive data."""

    _headers = {
        'accept': 'application/fhir+json',
        'content-type': 'application/fhir+json'
    }

    def __init__(self, server_url):
        """Initialize a Server object."""

        url = urlparse(server_url)
        # if url.scheme == 'http' and not url.netloc.lower() == 'localhost':
        #   raise Error('Refusing to send data over http.')

        self._capabilities = None
        hostname = url.netloc.split(':')[0]
        self._ip = socket.gethostbyname(hostname)  # Confirm DNS resolution.
        self._metadata = None
        self._url = url

        self._metadata = requests.get(
            f'{server_url}/metadata', headers=self.headers
        )
        if self._metadata.status_code != 200:
            raise Error(f'Failed to read {server_url}/metadata')
        self._capabilities = self._metadata.json()

    @property
    def headers(self):
        return self._headers

    @property
    def url(self):
        return self._url.geturl()

    def receive(self, bundle):
        # self.annotate_bundle_entries(bundle)  ## TODO: implement
        return requests.post(
            self.url, json=bundle, headers=self.headers
        )


def load_bundle(server, bundle):
    print(f'LOADING BUNDLE...')
    r = server.receive(bundle)
    success = ['200', '201', '200 OK', '201 Created']
    if r.status_code == 200:
        for entry in json.loads(r.content)['entry']:
            if entry['response']['status'] not in success:
                print(f'Entry failed to load: {entry}')
    else:
        print('failed to send bundle to server', r.reason)
        pprint.pprint(r.__dict__)  # XXX
        pprint.pprint(r.raw.__dict__)  # XXX


def list_files(dirname):
    """Yields the absolute path json file names from a directory."""
    for filename in sorted(glob.glob(f'{dirname}{os.path.sep}*.json')):
        yield os.path.abspath(filename)


@click.command()
@click.option(
    '--data', '-d', default='.', show_default=True,
    help='Folder containing synthea output json files to load.'
)
@click.option(
    '--server', '-s', default=TEST_SERVER, show_default=True,
    help='An open FHIR server base URL.  Set to "" to disable.'
)
@click.option(
    '--tag', '-t', default=RESOURCE_TAG, show_default=True
)
def main(data, server, tag):
    entry_updatr = EntryReferenceUpdater()
    entry_tagger = EntryTagger(tag)
    bundle_count = 0

    if server:
        fhir_server = Server(server)

    if data and not os.path.isdir(data):
        raise Exception(f'Data dir does not exist: {data}')

    for json_file in list_files(data):
        with open(json_file) as fd:
            bundle = json.loads(fd.read())
            entries = bundle['entry']
            entries[:] = [e for e in entry_updatr.update(entries)]
            entries[:] = [e for e in entry_tagger.tag(entries)]
            bundle_count += 1

        if server:
            load_bundle(fhir_server, bundle)


if __name__ == '__main__':
    main()  # pylint: disable=no-value-for-parameter
