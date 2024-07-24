import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from 'redux/configureStore';
import './index.css';
import Env from 'utils/Env';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/core/styles';
import './index.scss';

import 'bootstrap/dist/css/bootstrap.min.css';

import WebFont from 'webfontloader';
import theme from './theme/tether-bet';

WebFont.load({
  google: {
    families: ['Roboto'],
  },
});

if (process.env.NODE_ENV !== 'development' && !!Env.GA_ID) {
  ReactGA.initialize(Env.GA_ID);
}

ReactDOM.render(
  <Provider store={Store}>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
