import { drain, filterLists, getRefsFrom, resolvePatients } from 'api';
import React from 'react';
import { Radio, RadioGroup } from "@blueprintjs/core";
import { Resource } from 'components/FHIRResource';

const debug = false;  // XXX

// TODO: move this to a FHIRGroup module?
// TODO: create a src.components.fhir folder?

// A FHIR Resource in a table row.
function ResourceRow(props) {
  const resource = props.resource;
  const key = `${resource.resourceType}/${resource.id}`;
  return (
    <Radio
      key={key}
      value={key}
    >
      <Resource
        display={resource.name}
        resource={resource}
        getHoverData={(resource) => {
          return [
            ['reference', (
              <a
                href={encodeURI(`${props.serverRootURL}/${key}`)}
                style={{color: 'yellow'}}
                rel="noopener noreferrer"
                target="_blank"
              >
                {key}
              </a>
            )],
            ['actual', resource.actual ? 'true' : 'false'],
            ['type', resource.type],
            ['members', resource.member ? resource.member.length : '?'],
            // TODO: add any other relevant hover-text fields here.
          ];
        }}
      />
    </Radio>
  );
}

// A sorted list of patient lists, pre-filtered by the current filter selection.
function ListSelector(props) {
  // TODO: pull this up to the main panel.
  const [selectedList, setSelectedList] = React.useState();
  if (!props.lists) {
    return <></>;
  }

  function getList(reference) {
    return props.lists.filter(
      (x) => `Group/${x.resource.id}` === reference
    )[0];
  }

  return (
    <RadioGroup
      onChange={(e) => {
        setSelectedList(e.target.value);
        props.handleListSelection(getList(e.target.value).resource);
      }}
      selectedValue={selectedList}
    >{
        props.lists.map((x) => {
          return ResourceRow({
            handleListSelection: props.handleListSelection,
            resource: x.resource,
            serverRootURL: props.serverRootURL,
          });
        })
      }
    </RadioGroup>
  );
}

// A panel of selectable patient lists with optional filters.
class ListsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverRoot: props.serverRootURL,
      bearerToken: props.bearerToken,
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

  // TODO: move this into api.js
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

  // Returns a summary of the available lists.
  getDiscoveryUrl() {
    const params = [['_summary', 'true']];
    if (this.props.tagSystem && this.props.tagCode) {
      params.push(['_tag', `${this.props.tagSystem}|${this.props.tagCode}`]);
    }
    const encodedParamString = params
      .map(kv => kv.map(encodeURIComponent).join("="))
      .join("&");
    const query = encodedParamString ? `?${encodedParamString}` : '';
    return `${this.props.serverRootURL}/Group${query}`;
  }

  refreshResources(resourceType, stateLocation, includes, validator) {
    const url = this.getRefreshQueryUrl(resourceType, includes);
    drain(url, this.props.bearerToken, (x, total) => { this.progressCallback(resourceType, x, total); })
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

  discoverLists() {
    drain(this.getDiscoveryUrl(), this.props.bearerToken)
      .then(b => this.setState({ 'groups': b.entry }));
  }

  refreshData() {
    this.props.setPatients([]);
    if (this.props.requireSummaryDiscovery) {
      this.discoverLists();
    } else {
      this.refreshResources('Group', 'groups');
    }
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
      (this.state.bearerToken !== this.props.bearerToken) ||
      (this.state.tagCode !== this.props.tagCode) ||
      (this.state.tagSystem !== this.props.tagSystem);

    if (needsRefresh) {
      this.refreshData();
      this.setState({
        serverRoot: this.props.serverRootURL,
        bearerToken: this.props.bearerToken,
        tagCode: this.props.tagCode,
        tagSystem: this.props.tagSystem,
      });
    }
  }

  handleListSelection(resource) {
    drain(
      `${this.props.serverRootURL}/Group/${resource.id}`,
      this.props.bearerToken
    ).then(
      group => resolvePatients(
        this.props.serverRootURL,
        this.props.bearerToken,
        group,
      ).then(this.props.setPatients)
    );
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

    // TODO: pass in a hook state for the selectedList and a setter.  This will allow a data refresh to
    //       un-select the current selected list (which would be needed when changing servers).

    // NICE: turn this into a NavBar: https://blueprintjs.com/docs/#core/components/navbar followed by a scrollable ListSelector
    return (
      <>
        <div style={{ fontWeight: 'bold' }} >
          Patient Lists ({this.state.groups ? this.state.groups.length : 0})
        </div>
        <div style={{ overflowY: 'scroll' }} >
          <ListSelector
            handleListSelection={this.handleListSelection}
            lists={filterLists(lists, selections)}
            serverRootURL={this.props.serverRootURL}
            bearerToken={this.props.bearerToken}
          />
        </div>
      </>
    );
  }
}

export default ListsPanel;