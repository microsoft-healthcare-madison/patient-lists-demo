import React from 'react';
import 'components/DeveloperPanel.css'
import { Button, Callout, Collapse } from "@blueprintjs/core";

// NICE: enable this panel to be resized up and down.

export default function DeveloperPanel(props) {
  let messages = props.developerMessages || <pre key="0">None</pre>;
  const [isHidden, setIsHidden] = React.useState(true);

  return (
    <>
      <Button
        onClick={() => {setIsHidden(!isHidden)}}
        style={{zIndex: 1, position: 'relative'}}
      >
        {isHidden ? "Show" : "Hide"} Developer Messages
      </Button>
      <Collapse isOpen={!isHidden}>
        <Callout title="Developer Messages (Most Recent At Top)">
          <div style={{overflowY: 'scroll'}}>
            {messages}
          </div>
        </Callout>
      </Collapse>
    </>
  );
}
