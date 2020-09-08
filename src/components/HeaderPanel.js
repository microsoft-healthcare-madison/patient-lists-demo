import React from 'react';
import 'components/HeaderPanel.css'
import { Button, Collapse } from "@blueprintjs/core";

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

  const applySettingsButton = (event) => {
    event.preventDefault();
    props.setServerRootURL(serverRootURL);
    props.setTagCode(tagCode);
    props.setTagSystem(tagSystem);
  }

  // Updates the input field value as the user enters new values.
  const serverRootChanged = (event) => {
    const value = event.target.value.trim();
    setServerRootURL(value);
    try {
      new URL(value);
      fetch(value + '/CapabilityStatement')
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
  render() {
    return (
      <div>
        <span className="app-title">{appTitle}</span>
        <ServerInputForm
          developerMessages={this.props.developerMessages}
          serverRootURL={this.props.serverRootURL}
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
