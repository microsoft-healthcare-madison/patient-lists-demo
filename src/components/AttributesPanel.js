import React from 'react';
import 'components/AttributesPanel.css'
import { Checkbox, HTMLTable } from '@blueprintjs/core';

// NICE: reveal this panel by clicking a Button.

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
  // Applies the changes.
  function handleAttributeSelected(event, what) {
    const setColumns = props.setExtraAttributeGetters;
    if (event.target.checked) {
      setColumns([...props.extraAttributeGetters, what]);
    } else {
      setColumns(props.extraAttributeGetters.filter(x => x[0] !== what[0]));
    }
  }

  return (
    <>
      <div style={{ fontWeight: 'bold' }} >
        Extra Attributes
      </div>
      <span style={{ overflowY: 'scroll' }} >
        <HTMLTable condensed={true}>
          <tbody>
            {extraAttributeGetters
              .map(x =>
                <tr key={x[0]}>
                  <td>
                    <Checkbox
                      onChange={(e) => handleAttributeSelected(e, x)}
                      checked={props.isChecked}
                    >
                      {x[0]}
                    </Checkbox>
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
