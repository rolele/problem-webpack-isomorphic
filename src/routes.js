// TODO NotFound
// TODO webpack eslint alias
// TODO use store
// This config will generate <Switch> route so only the first matching will be rendered
// TODO https://github.com/ReactTraining/react-router/issues/4962
// https://github.com/strues/boldr
import { EmptyWrapper } from './modules';

const configureRoutes = (store) => [
  { component: EmptyWrapper,
    routes: [],
  },
];

export default configureRoutes;
