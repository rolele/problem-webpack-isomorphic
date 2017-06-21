import { shape, array } from 'prop-types';

export ApiClient from './ApiClient';

export const routePropTypes = {
  route: shape({
    routes: array.isRequired,
  }),
};

export const routeDefaultProps = {
  route: {
    routes: [],
  },
};
