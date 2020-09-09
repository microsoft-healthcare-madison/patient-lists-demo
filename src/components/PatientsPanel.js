import React from 'react';
import 'components/PatientsPanel.css'
import { HTMLTable } from '@blueprintjs/core';

// TODO: decide how to enable the on-hover data for patients, just like in the lists panel

function getRow(patient, attributeGetters) {
  return attributeGetters.map(getter => getter[1](patient));
}

function getData(patients, attributeGetters) {
  return patients.map(patient => getRow(patient, attributeGetters));
}

function getName(patient) {
  if (patient && patient.name) {
    const officialNames = patient.name.filter(name => name.use === 'official');
    if (officialNames.length) {
      const name = officialNames[0];
      const names = name.given.map(fn => `${fn} ${name.family}`);
      if (names.length) {
        return names[0].replace(/[0-9]/g, '');
      }
    }
  }
  return 'J. Doe';
}

function getAge(patient) {
  const ageMs = Date.now() - Date.parse(patient.birthDate);
  return Math.trunc(new Date(ageMs).getUTCFullYear() - 1970);
}

const patientAttributeGetters = [
  ['ID', p => p.id],
  ['Name', getName],
  ['Age', getAge],
  ['Sex', p => p.gender === 'female' ? 'F' : 'M'],
];

export default function PatientsPanel(props) {
  const getters = [...patientAttributeGetters, ...props.extraAttributeGetters];
  const columns = getters.map(x => x[0]);
  return (
    <>
      <div style={{ fontWeight: 'bold' }} >
        Patients ({props.patients.length} selected)
      </div>
      <span style={{ overflowY: 'scroll' }} >
        <HTMLTable condensed={true} interactive={true}>
          <thead>
            <tr key="patientsPanelHeaders">{columns.slice(1).map(x =>
              <th key={x}>{x}</th>
            )}</tr>
          </thead>
          <tbody>
            {getData(props.patients, getters).map(row =>
              <tr key={`patientsPanelPatient/${row[0]}`}>{row.slice(1).map((col, i) =>
                <td key={`Patient/${row[0]}/${i}`}>{col}</td>
              )}</tr>
            )}
          </tbody>
        </HTMLTable>
      </span>
    </>
  );
}
