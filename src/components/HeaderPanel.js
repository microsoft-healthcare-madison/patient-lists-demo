import React from 'react';
import 'components/HeaderPanel.css'
import { Button, Collapse, InputGroup, Tooltip } from "@blueprintjs/core";

const appTitle = "Patient Lists Demo App";

// NICE: Remake this as a NavBar: https://blueprintjs.com/docs/#core/components/navbar
//       The Server Root URL can be part of a Settings Cog, then.

// EASY: add a blueprint Toast when a server entry has been entered and accpeted:
//       https://blueprintjs.com/docs/#core/components/toast

function ServerInputForm(props) {
  const [serverRootURL, setServerRootURL] = React.useState(props.serverRootURL);
  const [validURL, setValidURL] = React.useState(true);
  const [tagSystem, setTagSystem] = React.useState(props.tagSystem);
  const [tagCode, setTagCode] = React.useState(props.tagCode)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [showToken, setShowToken] = React.useState(false);
  const [token, setToken] = React.useState('');

  const applySettingsButton = (event) => {
    event.preventDefault();
    props.setServerRootURL(serverRootURL);
    props.setTagCode(tagCode);
    props.setTagSystem(tagSystem);
    props.setBearerToken(token);
  }

  // Updates the input field value as the user enters new values.
  const serverRootChanged = (event) => {
    const value = event.target.value.trim();
    setServerRootURL(value);
    try {
      new URL(value);
      const metadataUrl = (value + '/metadata').replace(/([^:]\/)\/+/g, "$1");
      fetch(metadataUrl)
        .then(() => setValidURL(true))
        .catch(() => setValidURL(false));
    } catch(e) {
      setValidURL(false);
    }
  }

  // Updates the input field as the user enters new values.
  const tagSystemChanged = (event) => {
    setTagSystem(event.target.value.trim());
  }

  // Updates the input field as the user enters new values.
  const tagCodeChanged = (event) => {
    setTagCode(event.target.value.trim());
  }

  const lockButton = (
    <Tooltip content={`${showToken ? "Hide" : "Show"} Token`}>
      <Button
        icon={showToken ? "unlock" : "lock"}
        minimal={true}
        onClick={() => setShowToken(!showToken)}
      />
    </Tooltip>
  );

  const tokenInput = (event) => {
    setToken(event.target.value);
  }

  // TODO: replace this homebrewed form with a blueprint FormGroup, maybe.
  return (
    <>
      <Button
        onClick={ () => { setIsSettingsOpen(!isSettingsOpen); } }
      >{ isSettingsOpen ? "Hide" : "Show" } Settings</Button>
      <Collapse
        isOpen={isSettingsOpen}
        keepChildrenMounted={true}
      >
        <form className="server" onSubmit={applySettingsButton}>
          <label>FHIR Server Root</label>
          &nbsp;
          <input
            className="url"
            type="text"
            value={serverRootURL}
            onChange={serverRootChanged}
          />
          <br></br>
          <br></br>

          <label>Authentication</label>
          <table>
            <tbody>
              <tr><td>Bearer Token</td></tr>
              <tr><td>
                <InputGroup
                  placeholder="Enter a bearer token..."
                  rightElement={lockButton}
                  type={showToken ? "text" : "token"}
                  onInput={tokenInput}
                />
              </td></tr>
            </tbody>
          </table>
          <br></br>
          <br></br>

          <label>Data Tag</label>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>system</label>
                </td>
                <td>
                  <input
                    className="url"
                    type="text"
                    value={tagSystem}
                    onChange={tagSystemChanged}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>code</label>
                </td>
                <td>
                  <input
                    type="text"
                    value={tagCode}
                    onChange={tagCodeChanged}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button type="submit" disabled={!validURL}>Apply</Button>
        </form>
      </Collapse>
    </>
  );
}

class HeaderPanel extends React.Component {
  // TODO: handle requireSummaryDiscovery here with a checkbox
  render() {
    return (
      <div>
        <span className="app-title">{appTitle}</span>
        <ServerInputForm
          bearerToken={this.props.bearerToken}
          developerMessages={this.props.developerMessages}
          serverRootURL={this.props.serverRootURL}
          setBearerToken={this.props.setBearerToken}
          setDeveloperMessages={this.props.setDeveloperMessages}
          setServerRootURL={this.props.setServerRootURL}
          setTagCode={this.props.setTagCode}
          setTagSystem={this.props.setTagSystem}
          tagCode={this.props.tagCode}
          tagSystem={this.props.tagSystem}
      />
      </div>  
    );
  }
}

export default HeaderPanel;
