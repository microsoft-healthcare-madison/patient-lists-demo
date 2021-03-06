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
import copy
import functools
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
    _referrers = {}

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

    def update_references(self, resource, parent_uuid):
        """Recursively updates all references in a Resource to be conditional.

        See Conditional References: https://www.hl7.org/fhir/http.html#trules

        An index of referrers is cached in self._referrers to map the resource
        that is referenced to the resources that reference it.

        Param:
          resource: a FHIR Resource dict.
          parent_uuid: str, the uuid of the enclosing Resource (the referrer).
        """
        if resource.__class__.__name__ != 'dict':
            return
        for key, value in resource.items():
            if key == 'reference' and value.startswith('urn:uuid:'):
                uuid = value.split(':')[-1]
                self._referrers.setdefault(uuid, set()).add(parent_uuid)
                if uuid in self._id_type:
                    resource[key] = f"{self._id_type[uuid]}?identifier={uuid}"
            elif value.__class__.__name__ == 'dict':
                self.update_references(value, parent_uuid)  # Recurse!
            elif value.__class__.__name__ == 'list':
                for r in value:
                    self.update_references(r, parent_uuid)  # Recurse!

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
        self._referrers.clear()
        self.collect_ids(entries)
        for entry in entries:
            self.update_identifier(entry['resource'])
            self.update_request(entry)
            self.update_references(entry['resource'], entry['resource']['id'])
            yield entry

    def compare(self, left, right):
        left_id, right_id = left['resource']['id'], right['resource']['id']
        if left_id not in self._referrers:
            return 0
        if right_id in self._referrers[left_id]:
            return -1
        return 1


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

    def get(self, url):
        if not url.startswith('http'):
            url = f'{self.url}/{url}'
        return requests.get(url, headers=self._headers)

    def get_bundle_entries(self, url):
        """Yields all the entries from a bundle, de-paginating if needed."""
        bundle = self.get(url).json()
        while bundle.get('entry'):
            for entry in bundle['entry']:
                yield entry
            bundle['entry'].clear()
            for link in [x for x in bundle['link'] if x['relation'] == 'next']:
                bundle = self.get(link['url']).json()

    def post(self, url, payload):
        try:
            return requests.post(
                self.url + url,
                json=payload,
                headers=self.headers
            ).json()
        except Exception as e:
            print('ERR:', e)

    def receive(self, bundle):
        return requests.post(
            self.url, json=bundle, headers=self.headers
        )


def get_reference(resource):
    return '/'.join([resource['resourceType'], resource['id']])


def get_delete(reference):
    return {
        'request': {
            'method': 'DELETE',
            'url': reference,
        },
    }


def get_deletes(entries):
    deletes = []
    for e in entries:
        resource = e['resource']
        if resource['resourceType'] == 'Provenance':
            # Delete all the Provenance.targets before deleting the Provenance.
            references = [x['reference'] for x in resource['target']]
            # By reversing the numeric ID order, referenced objects will be
            # deleted before the referrers, avoiding any constraint violations.
            references.sort(key=lambda x: int(x.split('/')[1]), reverse=True)
            deletes.extend(map(get_delete, references))
        deletes.append(get_delete(get_reference(resource)))
    return deletes


def get_transaction_bundle(entries):
    return {
        'resourceType': 'Bundle',
        'type': 'batch',
        'entry': get_deletes(entries),
    }


def delete_tagged(server, tag, url, show=False):
    query = f'{url}?_count=1000&_tag={tag}'
    entries = list(server.get_bundle_entries(query))
    if entries:
        if show:
            print(f'Found {len(entries)} {url.rsplit("/", 1)[0]}')
        server.post('', get_transaction_bundle(entries))


def indiscriminant_delete(server, tag):
    synthea_types = [
        'Group',
        'Provenance',
        'AllergyIntolerance',
        'Bundle',
        'CarePlan',
        'CareTeam',
        'Claim',
        'Condition',
        'Coverage',
        'DiagnosticReport',
        'DocumentReference',
        'Encounter',
        'ExplanationOfBenefit',
        'ImagingStudy',
        'Immunization',
        'Location',
        'MedicationRequest',
        'Observation',
        'Organization',
        'Patient',
        'Practitioner',
        'PractitionerRole',
        'Procedure',
        'ServiceRequest'
    ]
    for resourceType in synthea_types:
        delete_tagged(server, tag, f'/{resourceType}', show=True)


def delete_everything(server, tag):
    print(f'Deleting resources tagged with {tag} on {server.url}...')
    delete_tagged(server, tag, '/Group')
    delete_tagged(server, tag, '/Provenance')
    indiscriminant_delete(server, tag)  # XXX


def load_bundle(server, bundle):
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
    '--tag', '-t', default=RESOURCE_TAG, show_default=True,
    help='A data tag applied to loaded (or found on deleted) resources.',
)
@click.option(
    '--delete-all/--no-delete', '-D', default=True, show_default=True,
    help='Deletes all resources tagged with the --tag value.'
)
def main(data, server, tag, delete_all):
    entry_updatr = EntryReferenceUpdater()
    entry_tagger = EntryTagger(tag)
    bundle_count = 0

    if server:
        fhir_server = Server(server)

    if delete_all:
        delete_everything(fhir_server, tag)

    if data and not os.path.isdir(data):
        raise Exception(f'Data dir does not exist: {data}')

    for json_file in list_files(data):
        with open(json_file) as fd:
            bundle = json.loads(fd.read())
            entries = bundle['entry']
            entries[:] = [e for e in entry_updatr.update(entries)]
            entries.sort(key=functools.cmp_to_key(entry_updatr.compare))
            entries[:] = [e for e in entry_tagger.tag(entries)]
            bundle_count += 1

        if server:
            print(f'LOADING BUNDLE...')
            b = copy.copy(bundle)
            for entry in entries:
                b['entry'] = [entry]
                load_bundle(fhir_server, b)


if __name__ == '__main__':
    main()  # pylint: disable=no-value-for-parameter
