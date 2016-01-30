import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

window.fbAsyncInit = function () {
  ReactDOM.render(<App />, document.getElementById('crashers'));
};
