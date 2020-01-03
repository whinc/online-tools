import React, {Suspense} from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import {SnackbarProvider} from 'notistack'
import PageLayout from "layout/PageLayout";
import { CircularProgress } from "@material-ui/core";
import routes from 'routes'

const PageLoading = () => {
  return (
    <PageLayout>
      <div style={{textAlign: 'center'}}>

      <CircularProgress />
      </div>
    </PageLayout>
  )
}

function App() {
  return (
    <SnackbarProvider>
    <Router>
      <Switch>
        <Redirect from='/' exact to='/home'/>
        {routes.map(route => (
          <Route key={route.path} path={route.path} exact={route.exact}>
            <Suspense fallback={<PageLoading />}>
              <route.component />
            </Suspense>
          </Route>
        ))}
      </Switch>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
