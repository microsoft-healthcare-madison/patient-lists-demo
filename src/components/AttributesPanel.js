import React from 'react';
import 'components/AttributesPanel.css'

const debug = false;

// TODO: add a single extra attribute to the table.
// TODO: decide what the tooltip will contain when hovering over the row.
export default function ExtraAttributesPanel(props) {
  const extraAttributes = props.extraAttributes;
  const setExtraAttributes = props.setExtraAttributes;

  console.log('ExtraAttributesPanel', props, extraAttributes);  // XXX
  if (debug) { console.log('ExtraAttributesPanel', setExtraAttributes); } // XXX

  return (
    <>
      <span>Extra Attributes</span>
    </>
  );
}
