(this["webpackJsonppatient-lists-demo"]=this["webpackJsonppatient-lists-demo"]||[]).push([[0],{135:function(e,t,n){e.exports=n(180)},140:function(e,t,n){},141:function(e,t,n){},172:function(e,t,n){},173:function(e,t,n){},174:function(e,t,n){},175:function(e,t,n){},180:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(13),c=n.n(o),s=(n(140),n(16)),l=n(6),i=n(41),u=n(42),m=n(45),p=n(44),f=(n(141),n(9));function d(e){var t=a.a.useState(e.serverRootURL),n=Object(l.a)(t,2),r=n[0],o=n[1],c=a.a.useState(!0),s=Object(l.a)(c,2),i=s[0],u=s[1],m=a.a.useState(e.tagSystem),p=Object(l.a)(m,2),d=p[0],h=p[1],v=a.a.useState(e.tagCode),g=Object(l.a)(v,2),b=g[0],E=g[1],y=a.a.useState(!1),k=Object(l.a)(y,2),S=k[0],R=k[1],C=a.a.useState(!1),j=Object(l.a)(C,2),O=j[0],T=j[1],L=a.a.useState(""),w=Object(l.a)(L,2),D=w[0],U=w[1],M=a.a.createElement(f.Tooltip,{content:"".concat(O?"Hide":"Show"," Password")},a.a.createElement(f.Button,{icon:O?"unlock":"lock",minimal:!0,onClick:function(){return T(!O)}}));return a.a.createElement(a.a.Fragment,null,a.a.createElement(f.Button,{onClick:function(){R(!S)}},S?"Hide":"Show"," Settings"),a.a.createElement(f.Collapse,{isOpen:S,keepChildrenMounted:!0},a.a.createElement("form",{className:"server",onSubmit:function(t){t.preventDefault(),e.setServerRootURL(r),e.setTagCode(b),e.setTagSystem(d),e.setBearerToken(D)}},a.a.createElement("label",null,"FHIR Server Root"),"\xa0",a.a.createElement("input",{className:"url",type:"text",value:r,onChange:function(e){var t=e.target.value.trim();o(t);try{new URL(t),fetch(t+"/CapabilityStatement").then((function(){return u(!0)})).catch((function(){return u(!1)}))}catch(n){u(!1)}}}),a.a.createElement("br",null),a.a.createElement("br",null),a.a.createElement("label",null,"Authentication"),a.a.createElement("table",null,a.a.createElement("tbody",null,a.a.createElement("tr",null,a.a.createElement("td",null,"Bearer Token")),a.a.createElement("tr",null,a.a.createElement("td",null,a.a.createElement(f.InputGroup,{placeholder:"Enter a bearer token...",rightElement:M,type:O?"text":"password",onInput:function(e){U(e.target.value)}}))))),a.a.createElement("br",null),a.a.createElement("br",null),a.a.createElement("label",null,"Data Tag"),a.a.createElement("table",null,a.a.createElement("tbody",null,a.a.createElement("tr",null,a.a.createElement("td",null,a.a.createElement("label",null,"system")),a.a.createElement("td",null,a.a.createElement("input",{className:"url",type:"text",value:d,onChange:function(e){h(e.target.value.trim())}}))),a.a.createElement("tr",null,a.a.createElement("td",null,a.a.createElement("label",null,"code")),a.a.createElement("td",null,a.a.createElement("input",{type:"text",value:b,onChange:function(e){E(e.target.value.trim())}}))))),a.a.createElement(f.Button,{type:"submit",disabled:!i},"Apply"))))}var h=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return a.a.createElement("div",null,a.a.createElement("span",{className:"app-title"},"Patient Lists Demo App"),a.a.createElement(d,{bearerToken:this.props.bearerToken,developerMessages:this.props.developerMessages,serverRootURL:this.props.serverRootURL,setBearerToken:this.props.setBearerToken,setDeveloperMessages:this.props.setDeveloperMessages,setServerRootURL:this.props.setServerRootURL,setTagCode:this.props.setTagCode,setTagSystem:this.props.setTagSystem,tagCode:this.props.tagCode,tagSystem:this.props.tagSystem}))}}]),n}(a.a.Component),v=n(43),g=n(51),b=n.n(g),E=n(82);function y(e,t){var n=function(e){return e&&e.entry?e.entry.map((function(e){return e.resource})).filter(Boolean):[]}(e);if(!n)return[];var r=function(e,t){return e.flatMap((function(e){return e.characteristic})).filter(Boolean).filter((function(e){return e.code&&e.code.coding&&e.code.coding.some((function(e){return"http://argonautproject.org/patient-lists/CodeSystem/characteristics"===e.system&&e.code===t}))}))}(n,t),a=new Set(r.map((function(e){return e.valueReference.reference})));return Object(s.a)(a).sort()}function k(){return(k=Object(E.a)(b.a.mark((function e(t,n,r){var a,o,c,l,i,u;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=[],o=t,c={headers:{Authorization:"Bearer ".concat(n)}};case 3:return e.next=5,fetch(o,n?c:void 0).then((function(e){return e.json()})).then((function(e){return a.push(e)}));case 5:(l=a.pop()).entry||(l.entry=[]),i=l.link.filter((function(e){return"next"===e.relation})),o=i.length?i[0].url:void 0,0===a.length?a.push(l):(u=a[0].entry).push.apply(u,Object(s.a)(l.entry)),r&&a.length&&a[0].entry&&r(a[0].entry.length,a[0].total);case 11:if(o){e.next=3;break}case 12:return e.abrupt("return",a[0]);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function S(e,t){var n=Object(s.a)(e);return t.length&&console.warn("Not Implemented yet: api.filterLists",t),n.sort((function(e,t){var n=e.resource.name||"",r=t.resource.name||"";return n.localeCompare(r)}))}function R(e){var t=e.resource,n="".concat(t.resourceType,"/").concat(t.id),r=e.display||n,o=!e.getHoverData,c=a.a.createElement("table",null);return e.getHoverData&&(c=a.a.createElement("table",null,a.a.createElement("tbody",null,e.getHoverData(t).map((function(e){var t=Object(l.a)(e,2),r=t[0],o=t[1];return a.a.createElement("tr",{key:"".concat(n,".").concat(r)},a.a.createElement("td",{style:{fontWeight:"bold"}},r),a.a.createElement("td",null,o))}))))),a.a.createElement(f.Tooltip,{content:c,disabled:o,transitionDuration:100,intent:"primary",boundary:"viewport",hoverCloseDelay:1e3,enforceFocus:!1},a.a.createElement("span",null,r))}function C(e){var t=a.a.useState(),n=Object(l.a)(t,2),r=n[0],o=n[1];if(!e.lists)return a.a.createElement(a.a.Fragment,null);return a.a.createElement(f.RadioGroup,{onChange:function(t){var n;o(t.target.value),e.handleListSelection((n=t.target.value,e.lists.filter((function(e){return"Group/".concat(e.resource.id)===n}))[0]).resource)},selectedValue:r},e.lists.map((function(t){return function(e){var t=e.resource,n="".concat(t.resourceType,"/").concat(t.id);return a.a.createElement(f.Radio,{key:n,value:n},a.a.createElement(R,{display:t.name,resource:t,getHoverData:function(t){return[["reference",a.a.createElement("a",{href:encodeURI("".concat(e.serverRootURL,"/").concat(n)),style:{color:"yellow"},rel:"noopener noreferrer",target:"_blank"},n)],["actual",t.actual?"true":"false"],["type",t.type],["members",t.member?t.member.length:0]]}}))}({handleListSelection:e.handleListSelection,resource:t.resource,serverRootURL:e.serverRootURL})})))}var j=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(e){var r;return Object(i.a)(this,n),(r=t.call(this,e)).state={groups:[],groupsIncluded:[],locations:[],locationsIncluded:[],serverRoot:e.serverRootURL,bearerToken:e.bearerToken,tagCode:e.tagCode,tagSystem:e.tagSystem},r.handleListSelection=r.handleListSelection.bind(Object(v.a)(r)),r}return Object(u.a)(n,[{key:"progressCallback",value:function(e,t,n){0}},{key:"getRefreshQueryUrl",value:function(e,t){var n=[];this.props.tagSystem&&this.props.tagCode&&n.push(["_tag","".concat(this.props.tagSystem,"|").concat(this.props.tagCode)]),t&&t.length&&n.push.apply(n,Object(s.a)(t.map((function(e){return["_include",e]}))));var r=n.map((function(e){return e.map(encodeURIComponent).join("=")})).join("&"),a=r?"?".concat(r):"";return"".concat(this.props.serverRootURL,"/").concat(e).concat(a)}},{key:"refreshResources",value:function(e,t,n,r){var a=this;(function(e,t,n){return k.apply(this,arguments)})(this.getRefreshQueryUrl(e,n),this.props.bearerToken,(function(t,n){a.progressCallback(e,t,n)})).then((function(n){var o={},c=n.entry.filter((function(t){return t.resource.resourceType===e})),s=n.entry.filter((function(t){return t.resource.resourceType!==e}));o[t]=c,o["".concat(t,"Included")]=s,r&&c.map((function(t){return r(e,t)})),a.setState(o)}))}},{key:"refreshData",value:function(){this.props.setPatients([]),this.refreshResources("Group","groups",["Group:member"]),this.refreshResources("Location","locations")}},{key:"componentDidMount",value:function(){this.refreshData()}},{key:"componentDidUpdate",value:function(){(this.state.serverRoot!==this.props.serverRootURL||this.state.bearerToken!==this.props.bearerToken||this.state.tagCode!==this.props.tagCode||this.state.tagSystem!==this.props.tagSystem)&&(this.refreshData(),this.setState({serverRoot:this.props.serverRootURL,bearerToken:this.props.bearerToken,tagCode:this.props.tagCode,tagSystem:this.props.tagSystem}))}},{key:"resolvePatients",value:function(e,t){var n=e.member?e.member:[],r=new Set(n.map((function(t){if(t&&t.entity)return t.entity.reference;console.log("resolvePatients.getReference: unknown reference type in:",e)})).filter((function(e){return e})));return t.map((function(e){return e.resource})).filter((function(e){return r.has("".concat(e.resourceType,"/").concat(e.id))}))}},{key:"handleListSelection",value:function(e){e.member?this.props.setPatients(this.resolvePatients(e,this.state.groupsIncluded)):this.props.setPatients([])}},{key:"render",value:function(){var e=this.state.groups;y(e,"at-location"),y(e,"attributed-to-organization"),y(e,"attributed-to-practitioner"),y(e,"attributed-to-careteam");return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{fontWeight:"bold"}},"Patient Lists (",this.state.groups.length,")"),a.a.createElement("div",{style:{overflowY:"scroll"}},a.a.createElement(C,{handleListSelection:this.handleListSelection,lists:S(e,[]),serverRootURL:this.props.serverRootURL,bearerToken:this.props.bearerToken})))}}]),n}(a.a.Component);n(172);function O(e){var t=e.developerMessages||a.a.createElement("pre",{key:"0"},"None"),n=a.a.useState(!0),r=Object(l.a)(n,2),o=r[0],c=r[1];return a.a.createElement(a.a.Fragment,null,a.a.createElement(f.Button,{onClick:function(){c(!o)},style:{zIndex:1,position:"relative"}},o?"Show":"Hide"," Developer Messages"),a.a.createElement(f.Collapse,{isOpen:!o},a.a.createElement(f.Callout,{title:"Developer Messages (Most Recent At Top)"},a.a.createElement("div",{style:{overflowY:"scroll"}},t))))}n(173);var T=[["ID",function(e){return e.id}],["Name",function(e){if(e&&e.name){var t=e.name.filter((function(e){return"official"===e.use}));if(t.length){var n=t[0],r=n.given.map((function(e){return"".concat(e," ").concat(n.family)}));if(r.length)return r[0].replace(/[0-9]/g,"")}}return"J. Doe"}],["Age",function(e){var t=Date.now()-Date.parse(e.birthDate);return Math.trunc(new Date(t).getUTCFullYear()-1970)}],["Sex",function(e){return"female"===e.gender?"F":"M"}]];function L(e){var t,n,r=[].concat(T,Object(s.a)(e.extraAttributeGetters)),o=r.map((function(e){return e[0]}));return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{fontWeight:"bold"}},"Patients (",e.patients.length," selected)"),a.a.createElement("span",{style:{overflowY:"scroll"}},a.a.createElement(f.HTMLTable,{condensed:!0,interactive:!0},a.a.createElement("thead",null,a.a.createElement("tr",{key:"patientsPanelHeaders"},o.slice(1).map((function(e){return a.a.createElement("th",{key:e},e)})))),a.a.createElement("tbody",null,(t=e.patients,n=r,t.map((function(e){return function(e,t){return t.map((function(t){return t[1](e)}))}(e,n)}))).map((function(e){return a.a.createElement("tr",{key:"patientsPanelPatient/".concat(e[0])},e.slice(1).map((function(t,n){return a.a.createElement("td",{key:"Patient/".concat(e[0],"/").concat(n)},t)})))}))))))}n(174);var w=[["Conditions",function(e){return["Asthma","Fibromyalgia","Cancer"]}],["Current Location",function(e){return"Ward 1"}],["Last Immunization",function(e){return"2019-12-26"}],["Latest Encounter",function(e){return"2020-08-21"}],["PCP",function(e){return"Dr. Doe"}]];function D(e){return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{fontWeight:"bold"}},"Extra Attributes"),a.a.createElement("span",{style:{overflowY:"scroll"}},a.a.createElement(f.HTMLTable,{condensed:!0},a.a.createElement("tbody",null,w.map((function(t){return a.a.createElement("tr",{key:t[0]},a.a.createElement("td",null,a.a.createElement(f.Checkbox,{onChange:function(n){return function(t,n){var r=e.setExtraAttributeGetters;t.target.checked?r([].concat(Object(s.a)(e.extraAttributeGetters),[n])):r(e.extraAttributeGetters.filter((function(e){return e[0]!==n[0]})))}(n,t)},checked:e.isChecked},t[0])))}))))))}n(175),n(176),n(177),n(178),n(179);var U=function(){var e=Object(r.useState)([]),t=Object(l.a)(e,2),n=t[0],o=t[1],c=Object(r.useState)([]),i=Object(l.a)(c,2),u=i[0],m=i[1],p=Object(r.useState)([]),f=Object(l.a)(p,2),d=f[0],v=f[1],g=Object(r.useState)("https://hapi.fhir.org/baseR4/"),b=Object(l.a)(g,2),E=b[0],y=b[1],k=Object(r.useState)(""),S=Object(l.a)(k,2),R=S[0],C=S[1],T=Object(r.useState)("http://hl7.org/Connectathon"),w=Object(l.a)(T,2),U=w[0],M=w[1],x=Object(r.useState)("2020-Sep"),P=Object(l.a)(x,2),A=P[0],N=P[1];return a.a.useEffect((function(){var e=a.a.createElement("pre",{key:Date.now()},"Updated FHIR Server root to: ",E);o((function(t){return[e].concat(Object(s.a)(t))}))}),[E]),a.a.createElement("div",{className:"App"},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"top"},a.a.createElement(h,{bearerToken:R,developerMessages:n,serverRootURL:E,setBearerToken:C,setDeveloperMessages:o,setServerRootURL:y,setTagCode:N,setTagSystem:M,tagCode:A,tagSystem:U}))),a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"left"},a.a.createElement(j,{bearerToken:R,developerMessages:n,serverRootURL:E,setDeveloperMessages:o,setPatients:v,tagCode:A,tagSystem:U})),a.a.createElement("div",{className:"center"},a.a.createElement(L,{bearerToken:R,extraAttributeGetters:u,patients:d,setDeveloperMessages:o})),a.a.createElement("div",{className:"right"},a.a.createElement(D,{bearerToken:R,extraAttributeGetters:u,setExtraAttributeGetters:m}))),a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"bottom"},a.a.createElement(O,{developerMessages:n}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function M(e){return e.strict?a.a.createElement(a.a.StrictMode,null,a.a.createElement(U,null)):a.a.createElement(U,null)}c.a.render(a.a.createElement(M,{strict:!1}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[135,1,2]]]);
//# sourceMappingURL=main.12809164.chunk.js.map