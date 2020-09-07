import React from 'react';
import 'components/DeveloperPanel.css'

// TODO: enable this panel to be shown or hidden by clicking a button.
// TODO: enable this panel to be resized.

class DeveloperPanel extends React.Component {
  render() {
    let messages = this.props.developerMessages || <pre key="0">None</pre>;
    return (
      <>
        <span>Developer Messages</span>
        <button>Hide</button><br></br>
        {messages}
      </>
    );
  }
}

export default DeveloperPanel;
