/* global webpackTools */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import { Html } from './modules';
import configureStore from './store';
import configureRoutes from './routes';
import { ApiClient } from 'helpers';
import { renderRoutes, matchRoutes } from 'react-router-config';

const client = new ApiClient();
const store = configureStore(client);
const routes = configureRoutes(store);

const fetchBranchData = (location) => {
  const branch = matchRoutes(routes, location);
  const promises = branch.map(({ route, match }) => {
    if(route.fetchData) {
      return route.fetchData(store, match)
    } else {
      return Promise.resolve(null)
    }
  });
  return Promise.all(promises);
}

export const renderApp = (req, callback) => {
  const location = req.url;
  const cookies = req.cookies;
  const assets = webpackTools.assets();
  const helmet = Helmet.rewind();
  const doctype = '<!DOCTYPE html>';

  if (__DEV__) {
    webpackTools.refresh();
  }

  if (!__SSR__) {
    console.log("SSR DISABLED FOR DEBUG PURPUSES!!!");
    const html = ReactDOMServer.
      renderToStaticMarkup(<Html assets={ assets } markup="" state={{}} helmet={ helmet } />);
    const body = doctype + html;
    callback(null, body);
    return;
  }

  fetchBranchData(location).then(data => {
    const context = {};
    var markup = ReactDOMServer.renderToString(
      <Provider store={ store }>
        <StaticRouter context={context} location={location}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );
    const state = store.getState();
    const html = ReactDOMServer
      .renderToStaticMarkup(<Html assets={ assets } markup={ markup } state={ state } helmet={ helmet } />);
    const body = doctype + html;
    const maxAge = new Date().getTime() * 0.001 + 14 * 24 * 3600;
    // res.cookie('authHeaders', JSON.stringify(getHeaders(store.getState())), { maxAge });
    callback(null, body);
  });
};

module.exports = renderApp;
