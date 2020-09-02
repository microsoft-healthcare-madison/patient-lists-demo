import React from 'react';
import 'components/ListsPanel.css'
import { Checkbox } from "@blueprintjs/core";


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
      serverRoot: props.serverRootURL
    };
    this.handleServerDiscovery = this.handleServerDiscovery.bind(this);
  }

  handleServerDiscovery(event) {
    this.props.onServerDiscovery(event.target.value);
    console.log("LIST PANEL WANTS TO REFRESH FILTER BOXES")
  }

  render() {
    return (
      <>
        <div className="debug">{this.props.serverRootURL}</div>
        <span>Patient Lists</span>
        <button>Resolve Patients</button>

        <h4>Filters</h4>
        <table border="1"><tbody>
          <tr><td>{locations}</td></tr>
          <tr><td>{practitioners}</td></tr>
          <tr><td>{organizations}</td></tr>
          <tr><td>{careTeams}</td></tr>
        </tbody></table>

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