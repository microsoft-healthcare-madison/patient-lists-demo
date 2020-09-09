import React from 'react';
import 'components/PatientsPanel.css'

// TODO: use a blueprint HTMLTable of data for this panel
// TODO: decide how to enable the on-hover data for patients, just like in the lists panel

function getRow(patient, attributeGetters) {
  return attributeGetters.map(getter => getter[1](patient));
}

function getData(patients, attributeGetters) {
  return patients.map(patient => getRow(patient, attributeGetters));
}

function getName(patient) {
  const officialNames = patient.name.filter(name => name.use === 'official');
  if (officialNames.length) {
    const name = officialNames[0];
    const names = name.given.map(fn => `${fn} ${name.family}`);
    if (names.length) {
      return names[0];
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
  console.log('PatientsPanel', props);  // XXX
  const getters = [...patientAttributeGetters, ...props.extraAttributeGetters];
  const columns = getters.map(x => x[0]);
  console.log('GOT DATA', columns, getters, getData(props.patients, getters));  // XXX
  return (
    <>
      <div style={{ fontWeight: 'bold' }} >
        Patients ({props.patients.length} selected)
      </div>
      <div style={{ overflowY: 'scroll' }} >
        <table>
          <tbody>
            <tr><td>HI</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
