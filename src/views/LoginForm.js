import React, { Component } from "react";

export default class LoginForm extends Component {
    _onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this._login, this._password);
    }
    render() {
        return (
            <form onSubmit={ e => this._onSubmit(e) }>
                <input type="text" placeholder="login" onChange={ e => this._login = e.target.value } />
                <input type="password" placeholder="password" onChange={ e => this._password = e.target.value } />
                <input type="submit" />
            </form>
        );
    }
}