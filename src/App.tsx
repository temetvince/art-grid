import React from "react";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage";
import ErrorPage from "./ErrorPage";
import GridPage, { GridPageProps } from "./GridPage";

function App(): JSX.Element {
   return (
      <main>
         <Switch>
            <Route exact path="/">
               <LandingPage />
            </Route>
            <Route
               path="/GridPage"
               render={(props) => (
                  // eslint-disable-next-line react/prop-types
                  <GridPage {...(props.location.state as GridPageProps)} />
               )}
            />
            <Route path="/Landing">
               <LandingPage />
            </Route>
            <Route path="*">
               <ErrorPage />
            </Route>
         </Switch>
      </main>
   );
}

export default App;
