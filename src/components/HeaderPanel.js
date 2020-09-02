import React from 'react';
import 'components/HeaderPanel.css'

const appTitle = "Patient Lists Demo App";
//const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";


class ServerInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.serverRootURL,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // TODO: visual feedback when a valid server URL is entered?  enable button?
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setServerRootURL(this.state.value);
  }

  render() {
    // TODO: replace with a blueprint FormGroup for prettier input.
    // TODO: bigger button, only enabled when a valid server is entered??
    return (
      <form className="server" onSubmit={this.handleSubmit}>
        <label>FHIR Server Root</label>
        &nbsp;
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" value="Discover Patient Lists" />
      </form>
    );
  }
}

class HeaderPanel extends React.Component {
  render() {
    return (
      <div>
        <span className="app-title">{appTitle}</span>
        <ServerInputForm
          serverRootURL={this.props.serverRootURL}
          setServerRootURL={this.props.setServerRootURL}
        />
      </div>  
    );
  }
}

export default HeaderPanel;
