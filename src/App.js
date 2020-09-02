import React from 'react';
import './App.css';
import headerPanel from 'components/HeaderPanel';

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
    <div className="App">
      <div className="row">
        <div className="top">
          {headerPanel}
        </div>
      </div>

      <div className="row">
        <div className="left">{listsPanel}</div>
        <div className="center">{patientsPanel}</div>
        <div className="right">{attributesPanel}</div>
      </div>

      <div className="row">
        <div className="bottom">
          {developerPanel}
        </div>
      </div>
    </div>
  );
}

export default App;
