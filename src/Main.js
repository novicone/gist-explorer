import React from "react";
import { createStore, applyMiddleware, bindActionCreators } from "redux";
import thunk from "redux-thunk";
import { Provider, connect } from "react-redux";
import { fromJS, List, Map, Record } from "immutable";

import { initializeApi } from "./api";
import App from "./views/App";

const GITHUB_API_URL = "https://api.github.com/user";

var AppStateRecord = Record({ api: null, gists: List(), selectedGist: null });

var store = applyMiddleware(thunk)(createStore)(reduce);
var ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

React.render(
    <Provider store={ store }>
        { () => <ConnectedApp /> }
    </Provider>
, document.body);

function reduce(state = AppStateRecord(), action) {
    switch(action.type) {
        case "showGistsView":
            return state.set("api", action.api);
        case "showGists":
            const { gists } = action;
            return state.merge({
                gists: gists,
                selectedGist: gists.get(0).get("id")
            });
        case "selectGist":
            return state.set("selectedGist", action.id);
        default:
            return state;
    }
}

function mapStateToProps(state) {
    const selectedGist = state.gists.find(gist => gist.get("id") === state.selectedGist);
    return {
        authorized: !!state.api,
        gists: state.gists.map(
            gist => Object.assign(mapGistToProps(gist), { selected: gist === selectedGist })
        ).toJS(),
        selectedGist: selectedGist && mapGistToProps(selectedGist)
    };
}

function mapGistToProps(gist) {
    const files = gist.get("files");
    return {
        id: gist.get("id"),
        title: files.keySeq().get(0),
        files: mapFilesToProps(files)
    };
}

function mapFilesToProps(files) {
    return files.valueSeq().map(file => {
        return {
            name: file.get("filename")
        }
    }).toJS();
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: authenticate,
        selectGist: selectGist
    }, dispatch);
}

function authenticate(login, password) {
    return dispatch => {
        var credentials = { login, password };

        initializeApi(GITHUB_API_URL, credentials).then(api => {
            if (api) {
                dispatch(showGistsView(api));
                dispatch(loadGists());
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
        var api = getState().get("api");
        api.getGists().then(gists => dispatch(showGists(fromJS(gists))));
    }
}

function showGists(gists) {
    const type = "showGists";
    return { type, gists };
}

function selectGist(id) {
    return { type: "selectGist", id };
}