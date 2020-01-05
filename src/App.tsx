import React, { Suspense } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import PageLayout from "layout/PageLayout";
import { CircularProgress} from "@material-ui/core";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import routes from "routes";
import {theme} from 'theme'

const PageLoading = () => {
  return (
    <PageLayout>
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    </PageLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <SnackbarProvider>
        <Router>
          <Switch>
            <Redirect from="/" exact to="/home" />
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
    </StylesProvider>
  </ThemeProvider>);
}

export default App;
