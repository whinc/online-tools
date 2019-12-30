import React, {Suspense} from "react";
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import {SnackbarProvider} from 'notistack'
import LoadingPage from 'pages/LoadingPage'
import NotFoundPage from 'pages/NotFoundPage'

type RouteConfig = {
  path: string,
  exact?: boolean,
  component: React.ElementType
}

const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('pages/IndexPage'))
  },
  {
    path: '/regexp',
    component: React.lazy(() => import('pages/RegExpPage'))
  },
  {
    path: '*',
    component: NotFoundPage
  }
]

function App() {
  return (
    <SnackbarProvider>
    <Router>
      <Switch>
        {routeConfigs.map(config => (
          <Route key={config.path} path={config.path} exact={config.exact}>
            <Suspense fallback={<LoadingPage />}>
              <config.component />
            </Suspense>
          </Route>
        ))}
      </Switch>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
