import React from 'react';
import './App.css';

// TODO: move this to components/appHeader.js
// TODO: replace this with a blueprint FormGroup?
const headerPanel = (
  <div>
    <span class="app-title">Patient Lists Demo App</span>
    <span class="server">
      FHIR Server Root
      <input></input>
      <button>Refresh Lists</button>
    </span>
  </div>
);

const listsPanel = (
  <span>Lists Panel HERE</span>
);

const patientsPanel = (
  <div>
    Patients Panel HERE
  </div>
);

const attributesPanel = (
  <div>
    Attributes Panel HERE
  </div>
);

const developerPanel = (
  <div>
    Developer Messages HERE
  </div>
);

function App() {
  return (
    <div classname="App">
      <div class="row">
        <div class="top">
          {headerPanel}
        </div>
      </div>

      <div class="row">
        <div class="left">{listsPanel}</div>
        <div class="center">{patientsPanel}</div>
        <div class="right">{attributesPanel}</div>
      </div>

      <div class="row">
        <div class="bottom">
          {developerPanel}
        </div>
      </div>
    </div>
  );
}

export default App;
