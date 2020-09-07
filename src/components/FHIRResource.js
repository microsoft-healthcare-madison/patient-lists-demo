/*
  A component that wraps a FHIR resource, enabling a hover-text popup with
  additional details about the resource.

  <Resource
    resource={resource}
    display={resource.name}
    hover={['id', 'url', 'age', 'gender', 'DOB']}
    />
  
  TODO
    [ ] define the class by how it's used elsewhere first.

  NICE
    [ ] hover-text shows extra details in a focusable pop-up panel
*/
import React from 'react'
import { Checkbox } from "@blueprintjs/core";


export class Resource extends React.Component {
  constructor(props) {
    super(props);
    const resource = this.props.resource;
    this.state = {
      checked: false,
      display: props.display || `${resource.resourceType}/${resource.id}`,
      hover: props.hover || [],
    }
    this.onChange = this.onChange.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  // TODO: define how the displayed portion of the resource is shown, and what goes into the hover-text popup
  render() {
    return (
      <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <Checkbox
          label={this.state.display}
          onChange={this.onChange}
          onMouseOver={this.onMouseOver}
        />
      </div>
    );
  }

  onMouseOut() {
    // TODO: hide details in a panel
  }

  onMouseOver() {
    // TODO: display details in a panel
  }

  onChange(event) {
    const checked = event.target.checked;
    this.setState({ checked: checked });
  }
}
