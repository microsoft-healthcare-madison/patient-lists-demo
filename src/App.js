import React from 'react';
import './App.css';
import attributesPanel from 'components/AttributesPanel';
import developerPanel from 'components/DeveloperPanel';
import headerPanel from 'components/HeaderPanel';
import listsPanel from 'components/ListsPanel';
import patientsPanel from 'components/PatientsPanel';

function App() {
  return (
    <div className="App">
      <div className="row">
        <div className="top">{headerPanel}</div>
      </div>

      <div className="row">
        <div className="left">{listsPanel}</div>
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
