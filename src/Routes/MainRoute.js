import React from "react";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import SignInPage from "../Pages/SignInPage/SignInPage";
import SignUpPage from "../Pages/SignUpPage/SignUpPage";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
const MainRoute = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
        <PrivateRoute exact path="/homepage" component={HomePage}/>
        <Route >
          <Redirect to="/signin" component={SignInPage} />
        </Route>
      </Switch>
    </Router>
  );
};

export default MainRoute;
