import React from 'react';
import 'components/ListsPanel.css'
import { Button, Checkbox, Collapse } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";


// This component allows the user to select a 'managingEntity' from the FHIR
// server.
function ManagingEntity(props) {
  React.useEffect(() => {
    console.log('ManagingEntity: I need to update');
  }, [props.serverRootURL]);  // XXX
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div>
    <Button onClick={() => { setIsOpen(!isOpen); console.log('HI'); }}>Managing Entity</Button>
    <Collapse
      isOpen={isOpen}
      keepChildrenMounted="true"
    >
      <table border="1"><tbody>
        <tr><td>{locations}</td></tr>
        <tr><td>{practitioners}</td></tr>
        <tr><td>{organizations}</td></tr>
        <tr><td>{careTeams}</td></tr>
      </tbody></table>
    </Collapse>
    </div>
  );
}

// TODO: return a blueprint MultiSelect here
function ListList(props) {
  return (
    <>
      <h4>Lists</h4>

    </>
  )
}

// TODO: get rid of these selectors - they should be dynamically populated from the server when a discovery is requested.
const locations = (
  <div className="bp3-select .modifier">
    <select defaultValue={'DEFAULT'}>
      <option value="DEFAULT">Locations...</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
      <option value="4">Four</option>
    </select>
  </div>
);

const practitioners = (
  <div className="bp3-select .modifier">
    <select defaultValue={'DEFAULT'}>
      <option value="DEFAULT">Practitioners...</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
      <option value="4">Four</option>
    </select>
  </div>
);

const organizations = (
  <div className="bp3-select .modifier">
    <select defaultValue="DEFAULT">
      <option value="DEFAULT">Organizations...</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
      <option value="4">Four</option>
    </select>
  </div>
);

const careTeams = (
  <div className="bp3-select .modifier">
    <select defaultValue={"DEFAULT"}>
      <option value="DEFAULT">Care Teams...</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
      <option value="4">Four</option>
    </select>
  </div>
);

class ListsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      serverRoot: props.serverRootURL,
    };
  }

  // TODO: modify the query to include ManagingEntity attributes (and anything else)
  refreshGroups() {
    fetch(this.props.serverRootURL + '/Group')
      .then(response => response.json())
      .then(bundle => this.setState({ groups: bundle}))
      .then(() => { console.log(this.state.groups); })  // XXX
  }

  componentDidMount() {
    this.refreshGroups();
  }

  // TODO: componentize the remaining UI objects (Filters, Lists, Header)
  // TODO: replace the Filters with text input boxes temporarily
  // TODO: attempt to scrape the server, pulling all Locations to populate the filter
  // TODO: query the server to get all the Lists, populating the checklist component (using the filters to select lists).
  // TODO: implement the Resolve Patients button.
  // TODO: incorporate the care team by provider taxonomy (maybe???) - http://hl7.org/fhir/us/core/STU3.1.1/ValueSet-us-core-careteam-provider-roles.html
  // TODO: beautify the header and Resolve button.
  render() {
    return (
      <>
        <span>Patient Lists</span>
        <button>Display Patients</button>

        <ManagingEntity serverRootURL={this.props.serverRootURL} />

        <h4>Lists</h4>
        <table><tbody>
          <tr><td><Checkbox>List 1</Checkbox></td></tr>
          <tr><td><Checkbox>List 2</Checkbox></td></tr>
          <tr><td><Checkbox>List 3</Checkbox></td></tr>
          <tr><td><Checkbox>List 4</Checkbox></td></tr>
          <tr><td><Checkbox>List 5</Checkbox></td></tr>
          </tbody></table>
      </>
    );
  }
}

export default ListsPanel;