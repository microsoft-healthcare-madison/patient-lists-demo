import React from 'react';
import 'components/AttributesPanel.css'
import { Checkbox, HTMLTable } from '@blueprintjs/core';

const debug = false;  // XXX


function getConditions(patient) {
  return ['Asthma', 'Fibromyalgia', 'Cancer'];
}

function getLatestEncounter(patient) {
  return '2020-08-21';
}

function getLastImmunization(patient) {
  return '2019-12-26';
}

function getLocation(patient) {
  return 'Ward 1';
}

function getPCP(patient) {
  // TODO: implement this
  return 'Dr. Doe';
}

const extraAttributeGetters = [
  ['Conditions', getConditions],
  ['Current Location', getLocation],
  ['Last Immunization', getLastImmunization],
  ['Latest Encounter', getLatestEncounter],
  ['PCP', getPCP],
];

// TODO: decide what the tooltip will contain when hovering over the row.
export default function ExtraAttributesPanel(props) {
  const extraAttributes = props.extraAttributes;
  const setExtraAttributes = props.setExtraAttributes;

  console.log('ExtraAttributesPanel', props, extraAttributes);  // XXX
  if (debug) { console.log('ExtraAttributesPanel', setExtraAttributes); } // XXX

  return (
    <>
      <div style={{ fontWeight: 'bold' }} >
        Extra Attributes
      </div>
      <span style={{ overflowY: 'scroll' }} >
        <HTMLTable condensed={true}>
          <tbody>
            {extraAttributeGetters
              .map(x => x[0])
              .map(x =>
                <tr key={x}>
                  <td>
                    <Checkbox>{x}</Checkbox>
                  </td>
                </tr>
              )
            }
          </tbody>
        </HTMLTable>
      </span>
    </>
  );
}
