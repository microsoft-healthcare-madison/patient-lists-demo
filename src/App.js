import React, {useState} from 'react';
import HeaderPanel from 'components/HeaderPanel';
import ListsPanel from 'components/ListsPanel';
import attributesPanel from 'components/AttributesPanel';
import developerPanel from 'components/DeveloperPanel';
import patientsPanel from 'components/PatientsPanel';

import './App.css';
import "normalize.css";
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

// TODO: update this with the public-facing URL, when it's available.
const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";
//const defaultServerRootURL = 'http://hapi.fhir.org/baseR4/';

function App() {
  const [serverRootURL, setServerRootURL] = useState(defaultServerRootURL);
  // TODO: create developer-panel state to be shared with other components

  return (
    <div className="App">
      <div className="row">
        <div className="top">
          <HeaderPanel
            serverRootURL={serverRootURL}
            setServerRootURL={setServerRootURL}
          /></div>
      </div>

      <div className="row">
        <div className="left">
          <ListsPanel
            serverRootURL={serverRootURL}
          />
        </div>
        <div className="center">{patientsPanel}</div>
        <div className="right">{attributesPanel}</div>
      </div>

      <div className="row">
        <div className="bottom">{developerPanel}</div>
      </div>
    </div>
  );
}

export default App;
