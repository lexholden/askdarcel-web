import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import routes from './routes';
import { configureStore } from './store';

require('./styles/main.scss');

const store = configureStore({ routing: routerReducer });
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={ history }>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
