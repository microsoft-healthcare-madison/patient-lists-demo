import { drain, getRefsFrom, filterLists } from 'api';
import React from 'react';
import 'components/ListsPanel.css'
import { Resource } from 'components/FHIRResource';

const debug = false;  // XXX

// A FHIR Resource in a table row.
function ResourceRow(props) {
  const resource = props.resource;
  const key = `${resource.resourceType}/${resource.id}`;
  return (
    <tr key={key}><td>
      <Resource
        display={props.resource.name}
        resource={props.resource}
      />
    </td></tr>
  );
}

// A list of patient lists, pre-filtered by the current filter selection.
function ListSelector(props) {
  if (!props.lists) {
    return <></>;
  }
  return (
    <table>
      <tbody>{
        props.lists.map((x) => {
          return ResourceRow({ resource: x.resource })
        })
      }</tbody>
    </table>
  );
}

class ListsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      locations: [],
      serverRoot: props.serverRootURL,
    };
  }

  // NICE: update something on-screen while data is loading.
  progressCallback(resourceType, loaded, total) {
    console.log(`Loaded ${loaded} of ${total} ${resourceType} records`);  // XXX
  }

  refreshResources(resourceType, stateLocation, validator) {
    const url = `${this.props.serverRootURL}/${resourceType}`;
    drain(url, (x, total) => { this.progressCallback(resourceType, x, total); })
      .then((bundle) => {
        const newState = {};
        newState[stateLocation] = bundle;
        if (validator) {
          bundle.entry.map(x => validator(x));
        }
        this.setState(newState);
      });
  }

  refreshData() {
    this.refreshResources('Group', 'groups');
    this.refreshResources('Location', 'locations');
    // NICE: examine the fetched data, logging a warning to DeveloperPanel if any look malformed
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate() {
    // Refresh ALL the cached data when the server component has changed.
    if (this.state.serverRoot !== this.props.serverRootURL) {
      this.refreshData();
      this.setState({ serverRoot: this.props.serverRootURL });
    }
  }

  render() {
    const bundle = this.state.groups;
    // TODO: group the characteristics selections into one function.
    const locations = getRefsFrom(bundle, 'at-location');
    // TODO: also collect Orgs and Docs from the ManagingEntity field (either should work).
    const orgs = getRefsFrom(bundle, 'attributed-to-organization');
    const docs = getRefsFrom(bundle, 'attributed-to-practitioner');
    //const careTeams = getRefsFrom(bundle, 'attributed-to-careteam');
    // TODO: get the component selections, saving them into an object.
    if (debug) {
      console.log('render selections from', locations, orgs, docs);  // XXX
    }
    const selections = [];

    // NICE: turn this into a NavBar: https://blueprintjs.com/docs/#core/components/navbar followed by a scrollable ListSelector
    return (
      <>
        <div>Patient Lists</div>
        <ListSelector
          lists={filterLists(bundle, selections)}
        />
      </>
    );
  }
}

export default ListsPanel;