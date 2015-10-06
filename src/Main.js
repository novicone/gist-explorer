import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider, connect } from "react-redux";

import { initializeApi } from "./api";
import App from "./views/App";

var store = applyMiddleware(thunk)(createStore)(reduce);
var ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

React.render(
    <Provider store={ store }>
        { () => <ConnectedApp /> }
    </Provider>
, document.body);

function reduce(state = {}, action) {
    switch(action.type) {
        case "showGistsView":
            return Object.assign({}, state, { api: action.api });
        case "showGists":
            return Object.assign({}, state, { gists: action.gists });
        default:
            return state;
    }
}

function mapStateToProps(state) {
    return {
        authorized: !!state.api,
        gists: state.gists
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: (login, password) => dispatch(authenticate(login, password)),
        loadGists: () => dispatch(loadGists())
    };
}

const GITHUB_API_URL = "https://api.github.com/user";

function authenticate(login, password) {
    return dispatch => {
        var credentials = { login, password };

        initializeApi(GITHUB_API_URL, credentials).then(api => {
            if (api) {
                dispatch(showGistsView(api));
            } else {
                dispatch(showLoginPrompt());
            }
        });
    };
}

function showGistsView(api) {
    const type = "showGistsView";
    return { type, api };
}

function showLoginPrompt() {
    return { type: "showLoginPrompt" };
}

function loadGists() {
    return (dispatch, getState) => {
        var { api } = getState();
        api.getGists().then(gists => dispatch(showGists(gists)));
    }
}

function showGists(gists) {
    const type = "showGists";
    return { type, gists };
}