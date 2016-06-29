import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import CategoryPage from './components/CategoryPage';
import ResourcesTable from './components/Resources/ResourcesTable';
import Resource from './components/Resource/Resource';

function redirectToRoot (nextState, replace) {
  replace({
    pathname: '/',
  });
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={CategoryPage} />
    <Route path="resources" component={ResourcesTable} />
    <Route path="resource/:id" component={Resource} />
    <Route path="*" onEnter={redirectToRoot} />
  </Route>
);
