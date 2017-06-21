import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';
import { ApiClient } from 'helpers'; // eslint-disable-line
// TODO solve this eslint
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line
import configureStore from './store';
import configureRoutes from './routes';

const history = createHistory();
const store = configureStore(new ApiClient(), history, window.__INITIAL_STATE__);
const routes = configureRoutes(store);

if (__DEV__) {
  const { AppContainer } = require('react-hot-loader'); // eslint-disable-line
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
  // Hot reloading on the client
  if (module.hot) {
    module.hot.accept();
  }
} else {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {renderRoutes(routes)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
}
