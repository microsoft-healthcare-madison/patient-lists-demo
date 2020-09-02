import React from 'react';
import 'components/HeaderPanel.css'

const appTitle = "Patient Lists Demo App";
const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";


class ServerInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: defaultServerRootURL};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    // TODO: replace with a blueprint FormGroup for prettier input.
    return (
      <form className="server" onSubmit={this.handleSubmit}>
        FHIR Server Root &nbsp;
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" value="Discover Lists" />
      </form>
    );
  }
}

export default (
  <div>
    <span className="app-title">{appTitle}</span>
    <ServerInputForm />
  </div>
);
