// TODO: consider renaming this file

export const codeSystem = "http://argonautproject.org/patient-lists/CodeSystem/characteristics";


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

// Returns a de-paginated bundle of resources from an initial URL.
export async function drain(resourceUrl, progressCallback) {
  const bundles = [];
  let url = resourceUrl;
  do {
    // Fetch a bundle from the URL.
    await fetch(url)
      .then(response => response.json())
      .then(bundle => bundles.push(bundle));
    const newBundle = bundles.pop();

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
    if (progressCallback) {
      progressCallback(bundles[0].entry.length, bundles[0].total);
    }
  } while (url);
  return bundles[0];
}

// Returns a list of resources from a bundle based on in-app selections.
export function filterLists(bundle, selections) {
  // TODO: filter the bundle resources using the selections.
  return bundle.entry;
}