import React, { Component } from "react";
import LoginForm from "./LoginForm";
import GistsView from "./GistsView";

export default class App extends Component {
    render() {
        if (!this.props.authorized) {
            return (
                <LoginForm onSubmit={ this.props.login } />
            );
        }
        return (
            <GistsView {...this.props} />
        );
    }
}