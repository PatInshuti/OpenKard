import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './views/home';
import Published from './views/published';

export default function App() {
  return (
    <Router>
        <Switch>

          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/published/:urlid">
            <Published />
          </Route>

          <Route exact path="*">
            <Home />
          </Route>

        </Switch>
    </Router>
  );
}