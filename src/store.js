import { compose, applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
// TODO fix eslint import with webpack alias
import createMiddleware from 'middlewares/clientMiddleware'; // eslint-disable-line
import thunk from 'redux-thunk';
import reducer from './reducer';

const composedStore = (client, history) => compose(
  applyMiddleware(createMiddleware(client)),
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history)),
  __CLIENT__ && window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore);

const configureStore = (client, history, initialState) => {
  const store = composedStore(client, history)(reducer, initialState);
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer'); // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }
  return store;
};

export default configureStore;
