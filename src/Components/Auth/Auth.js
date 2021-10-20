import React from 'react'
import { Route, Switch } from "react-router-dom";
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
function Auth() {
    return (
        <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/signup" component={Signup} exact/>
        </Switch>
    )
}

export default Auth
