import React, { Component } from "react";

import LoginForm from "./LoginForm";
import GistsList from "./GistsList";
import GistDetails from "./GistDetails";

export default class App extends Component {
    render() {
        const props = this.props;
        const { authorized, login, gists, selectedGist } = props;
        if (!authorized) {
            return (
                <LoginForm onSubmit={ login } />
            );
        }
        if (!gists) {
            return <span>Loading...</span>;
        }
        return (
            <main>
                <GistsList { ...props } />
                <GistDetails { ...selectedGist } />
            </main>
        );
    }
}