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
    [ ] hover-text shows extra details in a focusable pop-up panel
    [ ] provide a link to the server resource page
*/
import React from 'react'
import { Tooltip } from "@blueprintjs/core";

export function Resource(props) {
  const resource = props.resource;
  const display = props.display || `${resource.resourceType}/${resource.id}`;
  const disabled = props.getHoverData ? false : true;
  let hoverContent = <div/>;  // placeholder
  if (props.getHoverData) {
    hoverContent = (
      <table>
        <tbody>
          {
            props.getHoverData(resource).map(([attribute, value]) => {
              return (
                <tr>
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
  return (
    <Tooltip content={hoverContent} disabled={disabled}>
      <div>{display}</div>
    </Tooltip>
  );
}
