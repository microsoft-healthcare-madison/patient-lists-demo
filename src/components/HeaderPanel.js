import React from 'react';
import 'components/HeaderPanel.css'

const appTitle = "Patient Lists Demo App";

// NICE: Remake this as a NavBar: https://blueprintjs.com/docs/#core/components/navbar
//       The Server Root URL can be part of a Settings Cog, then.

// NICE: as the server root value is typed, evaluate it for availability / regex sanity.
//       maybe after a few seconds time-out, enable the Discover Patient Lists button.
//       during the timeout period, display a spinner to indicate something's happening.

// EASY: add a blueprint Toast when a server entry has been entered and accpeted:
//       https://blueprintjs.com/docs/#core/components/toast

function ServerInputForm(props) {
  const [value, setValue] = React.useState(props.serverRootURL);

  const discoverListsButton = (event) => {
    event.preventDefault();
    props.setServerRootURL(value);
  }

  const serverRootChanged = (event) => {
    setValue(event.target.value);
    // TODO: examine the server value as it is entered.
    console.log('CHANGED', event.target.value);  // XXX
  }

  // TODO: replace the homebrewed form with a blueprint FormGroup, maybe.
  return (
    <form className="server" onSubmit={discoverListsButton}>
      <label>FHIR Server Root</label>
      &nbsp;
      <input
        type="text"
        value={value}
        onChange={serverRootChanged}
      />
      <input type="submit" value="Discover Patient Lists" />
    </form>
  );
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
