import React from "react";
import { createStore, applyMiddleware, bindActionCreators } from "redux";
import thunk from "redux-thunk";
import { Provider, connect } from "react-redux";

import { Creators as ActionCreators } from "./Actions";
import reducer from "./reducer";
import App from "./views/App";

const store = applyMiddleware(thunk)(createStore)(reducer);
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

React.render(
    <Provider store={ store }>
        { () => <ConnectedApp /> }
    </Provider>
, document.body);

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
        login: ActionCreators.authenticate,
        selectGist: ActionCreators.selectGist
    }, dispatch);
}
