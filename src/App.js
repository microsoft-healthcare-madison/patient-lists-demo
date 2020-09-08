import React, {useState} from 'react';
import HeaderPanel from 'components/HeaderPanel';
import ListsPanel from 'components/ListsPanel';
import DeveloperPanel from 'components/DeveloperPanel';
import attributesPanel from 'components/AttributesPanel';
import patientsPanel from 'components/PatientsPanel';

import './App.css';
import "normalize.css";
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

// TODO: update this with the public-facing URL, when it's available.
const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";
//const defaultServerRootURL = 'http://hapi.fhir.org/baseR4/';

function App() {
  const [tagSystem, setTagSystem] = useState('');  // TODO: add a default
  const [tagCode, setTagCode] = useState('');  // TODO: add a default
  const [serverRootURL, setServerRootURL] = useState(defaultServerRootURL);
  const [developerMessages, setDeveloperMessages] = useState([]);

  React.useEffect(() => {
    const message = (
      <pre key={Date.now()}>Updated FHIR Server root to: {serverRootURL}</pre>
    );
    setDeveloperMessages(d => [message, ...d]);
  }, [serverRootURL]);

  return (
    <div className="App">
      <div className="row">
        <div className="top">
          <HeaderPanel
            developerMessages={developerMessages}
            serverRootURL={serverRootURL}
            setDeveloperMessages={setDeveloperMessages}
            setServerRootURL={setServerRootURL}
            setTagCode={setTagCode}
            setTagSystem={setTagSystem}
            tagCode={tagCode}
            tagSystem={tagSystem}
          /></div>
      </div>

      <div className="row">
        <div className="left">
          <ListsPanel
            developerMessages={developerMessages}
            serverRootURL={serverRootURL}
            setDeveloperMessages={setDeveloperMessages}
            tagCode={tagCode}
            tagSystem={tagSystem}
          />
        </div>
        <div className="center">{patientsPanel}</div>
        <div className="right">{attributesPanel}</div>
      </div>

      <div className="row">
        <div className="bottom">
          <DeveloperPanel
            developerMessages={developerMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
