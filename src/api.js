// TODO: consider renaming this file

export const codeSystem = "http://argonautproject.org/patient-lists/CodeSystem/characteristics";
export const demoTag = {
  system: 'http://connectathon.fhir.org/',
  code: '2020-sep',
};


// Returns the non-empty resources from a bundle.
function getResources(bundle) {
  return bundle && bundle.entry ? bundle.entry.map(e => e.resource).filter(Boolean) : [];
}

// Returns the patient list characteristics matching a code (ie 'at-location').
function getCharacteristics(resources, code) {
  const hasChars = resources.flatMap(x => x.characteristic).filter(Boolean);
  return hasChars.filter(
    x => x.code && x.code.coding && x.code.coding.some(
      c => c.system === codeSystem && c.code === code
    )
  );
}

// Returns the sorted set of code references from lists in a bundle.
export function getRefsFrom(bundle, code) {
  const resources = getResources(bundle);
  if (!resources) {
    return [];
  }
  const ch7istics = getCharacteristics(resources, code);
  const locations = new Set(ch7istics.map(x => x.valueReference.reference));
  return [...locations].sort();
}

// NICE: When the results include resources of different types, there should be
//       separate bundles per type.  So, if the first pages of bundles contain
//       Group followed by pages of Patient bundles - the returned value should be
//       a list of 2 bundles with all the Groups and Patients separated.

// NICE: Don't return a Bundle.  Instead return a list of tuples: [[ResourceType, [resources]], ...]

// Returns a de-paginated bundle of resources from an initial URL.
export async function drain(resourceUrl, bearerToken, progressCallback) {
  const bundles = [];
  let url = resourceUrl;
  const authorization = {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }
  do {
    // Fetch a bundle from the URL.
    await fetch(url, bearerToken ? authorization : undefined)
      .then(response => response.json())
      .then(bundle => bundles.push(bundle));
    const newBundle = bundles.pop();
    if (!newBundle.entry) { newBundle.entry = []; }

    // If the search was paginated, prepare to fetch the following bundle.
    const next = newBundle.link.filter(x => x.relation === 'next');
    url = next.length ? next[0].url : undefined;

    // Build up the entries in the first bundle to include entries from all.
    if (bundles.length === 0) {
      bundles.push(newBundle);
    } else {
      bundles[0].entry.push(...newBundle.entry);
    }

    // Inform the caller of the current progress via callback, if defined.
    if (progressCallback && bundles.length && bundles[0].entry) {
      progressCallback(bundles[0].entry.length, bundles[0].total);
    }
  } while (url);
  return bundles[0];
}

// Returns a list of resources from a bundle based on in-app selections.
export function filterLists(lists, selections) {
  // Shallow-copy the list.
  const listsCopy = [...lists];

  // TODO: apply the filter by removing lists that match no selections.
  if (selections.length) {
    console.warn('Not Implemented yet: api.filterLists', selections);  // XXX
  }

  // Sort the remaining lists by name.
  return listsCopy.sort((a, b) => {
    const left = a.resource.name || '';
    const right = b.resource.name || '';
    return left.localeCompare(right);
  });
}
