/*
  A component that wraps a FHIR resource, enabling a hover-text popup with
  additional details about the resource.

  <Resource
    resource={resource}
    display={resource.name}
    getHoverData={(resource) => {
      return [
        ['id', resource.id],
        ['url', resource.url],
        ['name', resource.name],
      ];
    }}
    />
  
  NICE
    [ ] hover-text shows extra details in a *focusable* pop-up panel
*/
import React from 'react'
import { Tooltip } from "@blueprintjs/core";

export function Resource(props) {
  const resource = props.resource;
  const reference = `${resource.resourceType}/${resource.id}`
  const display = props.display || reference;
  const disabled = props.getHoverData ? false : true;
  let hoverContent = <table/>;  // placeholder
  if (props.getHoverData) {
    hoverContent = (
      <table>
        <tbody>
          {
            props.getHoverData(resource).map(([attribute, value]) => {
              return (
                <tr key={`${reference}.${attribute}`}>
                  <td style={{fontWeight: 'bold'}}>{attribute}</td>
                  <td>{value}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
  // TODO: figure out how to enable the tool-top to be focused when hovered-over.
  return (
    <Tooltip
      content={hoverContent}
      disabled={disabled}
      transitionDuration={100}
      intent="primary"
      boundary="viewport"
      hoverCloseDelay={1000}
      enforceFocus={false}
    >
      <span>{display}</span>
    </Tooltip>
  );
}
