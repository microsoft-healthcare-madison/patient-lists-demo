import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Returns a DemoApp either in strict or 'normal' mode.
function DemoApp(props) {
  if (props.strict) {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
  return <App />;
}

ReactDOM.render(
  <DemoApp strict={false} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
