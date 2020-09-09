import { drain, getRefsFrom, filterLists } from 'api';
import React from 'react';
import { Checkbox, HTMLTable } from "@blueprintjs/core";
import { Resource } from 'components/FHIRResource';

const debug = false;  // XXX

// TODO: move this to a FHIRGroup module?
// TODO: create a src.components.fhir folder?

// A FHIR Resource in a table row.
function ResourceRow(props) {
  const resource = props.resource;
  const key = `${resource.resourceType}/${resource.id}`;
  return (
    <tr key={key}>
      <td>
        <Checkbox
          onChange={(event) => props.handleListSelection(resource, event.target.checked)}
          checked={props.isChecked}
        >
          <Resource
            display={resource.name}
            resource={resource}
            getHoverData={(resource) => {
              const reference = `${resource.resourceType}/${resource.id}`;
              const href = encodeURI(`${props.serverRootURL}/${reference}`);
              const link = (
                <a href={href} style={{color: 'yellow'}} rel="noopener noreferrer" target="_blank">
                  {reference}
                </a>
              );
              return [
                ['reference', link],
                ['actual', resource.actual ? 'true' : 'false'],
                ['type', resource.type],
                ['members', resource.member ? resource.member.length : 0],
                // TODO: add any other relevant hover-text fields here.
              ];
            }}
          />
        </Checkbox>
      </td>
    </tr>
  );
}

// A sorted list of patient lists, pre-filtered by the current filter selection.
function ListSelector(props) {
  if (!props.lists) {
    return <></>;
  }
  return (
    <HTMLTable condensed={true}>
      <tbody>{
        props.lists.map((x) => {
          return ResourceRow({
            handleListSelection: props.handleListSelection,
            resource: x.resource,
            serverRootURL: props.serverRootURL,
          });
        })
      }</tbody>
    </HTMLTable>
  );
}

// A panel of selectable patient lists with optional filters.
class ListsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupsIncluded: [],
      locations: [],
      locationsIncluded: [],
      serverRoot: props.serverRootURL,
      tagCode: props.tagCode,
      tagSystem: props.tagSystem,
    };
    this.handleListSelection = this.handleListSelection.bind(this);
  }

  // NICE: update something on-screen while data is loading.
  progressCallback(resourceType, loaded, total) {
    if (debug) {
      console.log(`Loaded ${loaded} of ${total} ${resourceType} records`);
    }
  }

  // Returns a URL to refresh an optionally tagged resource type which may _include other types.
  getRefreshQueryUrl(resourceType, includes) {
    const params = [];
    if (this.props.tagSystem && this.props.tagCode) {
      params.push(['_tag', `${this.props.tagSystem}|${this.props.tagCode}`]);
    }
    if (includes && includes.length) {
      params.push(...includes.map(x => ['_include', x]));
    }
    const encodedParamString = params
      .map(kv => kv.map(encodeURIComponent).join("="))
      .join("&");
    const query = encodedParamString ? `?${encodedParamString}` : '';
    return `${this.props.serverRootURL}/${resourceType}${query}`;
  }

  refreshResources(resourceType, stateLocation, includes, validator) {
    const url = this.getRefreshQueryUrl(resourceType, includes);
    drain(url, (x, total) => { this.progressCallback(resourceType, x, total); })
      .then((bundle) => {
        const newState = {};
        const resources = bundle.entry.filter(e => e.resource.resourceType === resourceType);
        const included = bundle.entry.filter(e => e.resource.resourceType !== resourceType);
        newState[stateLocation] = resources;
        newState[`${stateLocation}Included`] = included;
        if (validator) {
          resources.map(x => validator(resourceType, x));
        }
        this.setState(newState);
      });
  }

  refreshData() {
    this.refreshResources('Group', 'groups', ['Group:member']);
    this.refreshResources('Location', 'locations');
    // NICE: examine the fetched data, logging a warning to DeveloperPanel if any look malformed
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate() {
    // Refresh ALL the cached data when the server component has changed.
    const needsRefresh =
      (this.state.serverRoot !== this.props.serverRootURL) ||
      (this.state.tagCode !== this.props.tagCode) ||
      (this.state.tagSystem !== this.props.tagSystem);

    if (needsRefresh) {
      this.refreshData();
      this.setState({
        serverRoot: this.props.serverRootURL,
        tagCode: this.props.tagCode,
        tagSystem: this.props.tagSystem,
      });
    }
  }

  // BUG: This app assumes that a Group's member.entity contains a 'reference' to a patient.
  //      The 'reference' member.entity attribute is technically optional - there are other
  //      ways to represent a reference to a list member.
  //      Maybe a validator can log a warning about that earlier in the UI when encountered
  //      (and fail gracefully).

  // TODO: move this logic to the api.js module, since it has nothing to do with rendering and
  //       everything to do with the new API.

  // TODO: include the FHIR server root URL in case it's needed to fetch a patient that's not
  //       in the cache already.

  // Returns the complete list of Patient resources who are members of a list.
  resolvePatients(list, cachedPatients) {

    // Returns the reference for a list member from the list.member fragment.
    function getReference(member) {
      if (member && member.entity) {
        return member.entity.reference;
      }
      console.log('resolvePatients.getReference: unknown reference type in:', list);
    }

    const members = list.member ? list.member : [];
    const memberRefs = new Set(members.map(getReference).filter(x => x));

    // NICE: if the member is not in the cache, log a warning somewhere, or maybe fetch it.

    return cachedPatients
      .map(x => x.resource)
      .filter(r => memberRefs.has(`${r.resourceType}/${r.id}`)
    );
  }

  // BUG: This is misleading.  The UI suggests that any number of lists can be selected, but this
  //      code only allows one at a time.  Unselecting a list empties the patient panel.
  //      A better way is described below, but this will have to do for now.
  handleListSelection(resource, checked) {
    // TODO: map the resource member references to the lists that are selected.
    //       Remove members from lists that are un-selected.
    //       Afterward, any members that are included in visible lists should appear in the
    //       Patients panel.
    if (!checked || !resource.member) {
      this.props.setPatients([]);
    } else {
      this.props.setPatients(
        this.resolvePatients(resource, this.state.groupsIncluded)
      );
    }
  }

  render() {
    const lists = this.state.groups;
    // TODO: group the characteristics selections into one function.
    const locations = getRefsFrom(lists, 'at-location');
    const orgs = getRefsFrom(lists, 'attributed-to-organization');
    const docs = getRefsFrom(lists, 'attributed-to-practitioner');
    const careTeams = getRefsFrom(lists, 'attributed-to-careteam');
    // TODO: get the component selections, saving them into an object.
    // TODO: also collect Orgs and Docs from the ManagingEntity field (either should work).
    if (debug) {
      console.log('render selections from', locations, orgs, docs, careTeams);  // XXX
    }
    const selections = [];

    // NICE: turn this into a NavBar: https://blueprintjs.com/docs/#core/components/navbar followed by a scrollable ListSelector
    return (
      <>
        <div style={{ fontWeight: 'bold' }} >
          Patient Lists ({this.state.groups.length})
        </div>
        <div style={{ overflowY: 'scroll' }} >
          <ListSelector
            handleListSelection={this.handleListSelection}
            lists={filterLists(lists, selections)}
            serverRootURL={this.props.serverRootURL}
          />
        </div>
      </>
    );
  }
}

export default ListsPanel;