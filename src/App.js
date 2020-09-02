import React, {useState} from 'react';
import './App.css';
import attributesPanel from 'components/AttributesPanel';
import developerPanel from 'components/DeveloperPanel';
import HeaderPanel from 'components/HeaderPanel';
import ListsPanel from 'components/ListsPanel';
import patientsPanel from 'components/PatientsPanel';

// TODO: update this with the public-facing URL.
const defaultServerRootURL = "http://localhost:8080/hapi-fhir-jpaserver/fhir/";

function App() {
  // TODO: bind the ListsPanel serverRootURL to the HeaderPanel.state
  const [serverRootURL, setServerRootURL] = useState(defaultServerRootURL);
  React.useEffect(() => {
    console.log('HI: Updated the server root URL');
  }, [serverRootURL]);  // XXX

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
        <div className="left"><ListsPanel serverRootURL={serverRootURL}/></div>
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
