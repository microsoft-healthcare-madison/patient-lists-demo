import React, {useState} from 'react';
import HeaderPanel from 'components/HeaderPanel';
import ListsPanel from 'components/ListsPanel';
import DeveloperPanel from 'components/DeveloperPanel';
import PatientsPanel from 'components/PatientsPanel';
import ExtraAttributesPanel from 'components/AttributesPanel';

import './App.css';
import "normalize.css";
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

// TODO: update this with the public-facing URL, when it's available.
//const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";
const defaultServerRootURL = 'https://hapi.fhir.org/baseR4/';
const defaultTagSystem = 'http://hl7.org/Connectathon'
const defaultTagCode = '2020-Sep'

function App() {
  const [developerMessages, setDeveloperMessages] = useState([]);
  const [extraAttributeGetters, setExtraAttributeGetters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [serverRootURL, setServerRootURL] = useState(defaultServerRootURL);
  const [bearerToken, setBearerToken] = useState('');
  const [tagSystem, setTagSystem] = useState(defaultTagSystem);
  const [tagCode, setTagCode] = useState(defaultTagCode);
  const [requireSummaryDiscovery, setRequireSummaryDiscovery] = useState(true);

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
            bearerToken={bearerToken}
            developerMessages={developerMessages}
            requireSummaryDiscovery={requireSummaryDiscovery}
            serverRootURL={serverRootURL}
            setBearerToken={setBearerToken}
            setDeveloperMessages={setDeveloperMessages}
            setRequireSummaryDiscovery={setRequireSummaryDiscovery}
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
            bearerToken={bearerToken}
            developerMessages={developerMessages}
            requireSummaryDiscovery={requireSummaryDiscovery}
            serverRootURL={serverRootURL}
            setDeveloperMessages={setDeveloperMessages}
            setPatients={setPatients}
            tagCode={tagCode}
            tagSystem={tagSystem}
          />
        </div>
        <div className="center">
          <PatientsPanel
            bearerToken={bearerToken}
            extraAttributeGetters={extraAttributeGetters}
            patients={patients}
            setDeveloperMessages={setDeveloperMessages}
          />
        </div>
        <div className="right">
          <ExtraAttributesPanel
            bearerToken={bearerToken}
            extraAttributeGetters={extraAttributeGetters}
            setExtraAttributeGetters={setExtraAttributeGetters}
          />
        </div>
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
