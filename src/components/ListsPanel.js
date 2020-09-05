import React from 'react';
import 'components/ListsPanel.css'
import { Button, Checkbox, Collapse } from "@blueprintjs/core";
//import { Suggest } from "@blueprintjs/select";

const codeSystem = "http://argonautproject.org/patient-lists/CodeSystem/characteristics";


// Returns the non-empty resources from a bundle.
function getResources(bundle) {
  return bundle ? bundle.entry.map(e => e.resource).filter(Boolean) : [];
}

// Returns the patient list characteristics matching a code (ie 'at-location').
function getCharacteristics(resources, code) {
  const hasChars = resources.flatMap(x => x.characteristic).filter(Boolean);
  return hasChars.filter(
    x => x.code.coding.some(c => c.system === codeSystem && c.code === code)
  );
}

// Returns the sorted set of Location references from lists in a bundle.
function getRefsFrom(bundle, code) {
  const resources = getResources(bundle);
  const characteristics = getCharacteristics(resources, code);
  const locations = new Set(characteristics.map(x => x.valueReference.reference));
  return [...locations].sort();
}

// TODO: use the props.locations to populate a list of locations to select
function LocationSelector(props) {
  console.log(props);
  return (
    <>
      {props.locations}
    </>
  );
}

// This component allows the user to select a 'managingEntity' from the FHIR
// server.
function ManagingEntity(props) {
  const [isVisible, setIsVisible] = React.useState(false);
  // TODO: for the filters, there needs to be a state and a setter for each.
  // TODO: create a React.useState for the selectors in the calling function, passing them through props
  // TODO: find a suitable blueprint object that can render a list given state and setters  MultiSelect, maybe?
  return (
    <>
      <Button
        onClick={ () => { setIsVisible(!isVisible); } }
      >Managing Entity</Button>
      <Collapse
        isOpen={isVisible}
        keepChildrenMounted="true"
      >
        <>
          <Button>Organization</Button>
          <Button>Practitioner</Button>
        </>
      </Collapse>
    </>
  );
}

function getSelectedLists(bundle, selections) {
  return [];
}

// TODO: populate this based on the properties selected
// TODO: define the parameters in a function comment
function ListSelector(props) {
  return (
    <table>
      <tbody>
        <tr><td><Checkbox>List 1</Checkbox></td></tr>
        <tr><td><Checkbox>List 2</Checkbox></td></tr>
        <tr><td><Checkbox>List 3</Checkbox></td></tr>
        <tr><td><Checkbox>List 4</Checkbox></td></tr>
        <tr><td><Checkbox>List 5</Checkbox></td></tr>
      </tbody>
    </table>
  );
}

class ListsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      serverRoot: props.serverRootURL,
    };
  }

  // TODO: modify the query to include ManagingEntity attributes (and anything else)
  // TODO: modify this to drain all the Groups if the results are paginated.
  refreshGroups() {
    fetch(this.props.serverRootURL + '/Group')
      .then(response => response.json())
      .then(bundle => this.setState({ groups: bundle}))
      .then(() => { console.log("REFRESHED", this.state.groups); })  // XXX
  }

  componentDidMount() {
    this.refreshGroups();
  }

  // TODO: componentize the remaining UI objects (Filters, Lists, Header)
  // TODO: replace this panel with a blueprint component
  render() {
    const bundle = this.state.groups;
    const locations = getRefsFrom(bundle, 'at-location');
    const orgs = getRefsFrom(bundle, 'attributed-to-organization');
    const docs = getRefsFrom(bundle, 'attributed-to-practitioner');
    const careTeams = getRefsFrom(bundle, 'attributed-to-careteam');
    // TODO: drop the this.state.groups bundle (since it might be big)?
    // TODO: get the component selections, saving them into an object.
    const selections = {};

    // TODO: turn this into a NavBar: https://blueprintjs.com/docs/#core/components/navbar followed by a scrollable ListSelector
    return (
      <>
        <div>Patient Lists</div>

        <LocationSelector
          locations={locations}
        />
        <ManagingEntity
          organizations={orgs}
          practitioners={docs}
        />
        <ListSelector
          lists={getSelectedLists(bundle, selections)}
        />
      </>
    );
  }
}

export default ListsPanel;