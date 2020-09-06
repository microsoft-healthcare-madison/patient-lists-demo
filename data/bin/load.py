#!/usr/local/bin/python3
"""A script to load FHIR resources into an open FHIR server.

Useage:
  load.py --output <folder> [--server <server_base>] [--deduped <folder>] [--tag id] [--delete-all]
    --output <folder> - a folder containing synthea fhir output json bundles
    --server <base> - a FHIR server base URL to PUT all data into
    --deduped <folder> - a folder to write bundles with unique entries as json
    --tag id - a string to tag all loaded resources with
    --delete-all - delete all resources matching the tag

TODO:
  [ ] inspect the response to map file fullUrls to server fullUrls
  [ ] remove the deduplicated output to files option (or fix it to work with transaction bundles).
  [ ] send deduplicated contents to the server.
  [ ] implement resource tagging
  [ ] implement delete-all

"""
import glob
import hashlib
import json
import os
import pprint
import re
import socket
import sys
from urllib.parse import urlparse

import click  # pip3 install click
import requests  # pip3 install requests

TEST_SERVER = 'http://localhost:8080/hapi-fhir-jpaserver/fhir'

class Error(Exception):
    pass


class EntryFilter:
  """Removes any entries from a bundle that have already been encountered."""

  def __init__(self, hash_algorithm):
    self._hash = hash_algorithm
    self._entry_hashes = {}
    self._filtered = 0

  def filter(self, entries):
    """Yields entries that have never been encountered."""
    for entry in entries:
      entry_str = json.dumps(entry).encode('utf-8')
      entry_hash = self._hash(entry_str).hexdigest()
      entry_id = entry['fullUrl']
      if self._entry_hashes.get(entry_id) != entry_hash:
        self._entry_hashes[entry_id] = entry_hash
        yield entry
      else:
        self._filtered += 1


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
    ## self.annotate_bundle_entries(bundle)  ## TODO: implement
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
  # TODO: replace with an os.walk solution if more than one dir level is needed.
  for filename in sorted(glob.glob(f'{dirname}{os.path.sep}*.json')):
    yield os.path.abspath(filename)


@click.command()
@click.option(
    '--output', '-o', default='.', show_default=True,
    help='Folder containing synthea output json files to load.'
)
@click.option(
    '--deduped', '-d', default='', show_default=True,
    help='Folder to write bundles with distinct entries, ordering files.'
)
@click.option(
    '--server', '-s', default=TEST_SERVER, show_default=True,
    help='An open FHIR server base URL.  Set to "" to disable.'
)
def main(output, deduped, server):
  entry_filter = EntryFilter(hashlib.md5)
  bundle_count = 0
  if server:
    fhir_server = Server(server)

  if deduped and not os.path.isdir(deduped):
    raise Exception(f'Deduped dir does not exist: {deduped}')

  for json_file in list_files(output):
    with open(json_file) as fd:
      bundle = json.loads(fd.read())
      entries = bundle['entry']
      entries[:] = [e for e in entry_filter.filter(entries)]
      bundle_count += 1

    if deduped:
      deduped_file = f'{deduped}{os.path.sep}{bundle_count:05}.json'
      with open(deduped_file, 'w') as fd:
        fd.write(json.dumps(bundle, indent=2))
        fd.write('\n')

    if server:
      load_bundle(fhir_server, bundle)


if __name__ == '__main__':
    main()  # pylint: disable=no-value-for-parameter
