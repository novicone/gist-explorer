import { fromJS } from "immutable";
import { initializeApi } from "./api";

export const Types = {
    SHOW_GISTS_VIEW: "showGistsView",
    SHOW_LOGIN_PROMPT: "showLoginPrompt",
    SHOW_GISTS: "showGists",
    SELECT_GIST: "selectGist"
};

export const Creators = { authenticate, showGistsView, showLoginPrompt, loadGists, showGists, selectGist };

const GITHUB_API_URL = "https://api.github.com/user";

function authenticate(login, password) {
    return dispatch => {
        const credentials = { login, password };

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
    return { type: Types.SHOW_GISTS_VIEW, api };
}

function showLoginPrompt() {
    return { type: Types.SHOW_LOGIN_PROMPT };
}

function loadGists() {
    return (dispatch, getState) => {
        const api = getState().get("api");
        api.getGists().then(gists => dispatch(showGists(fromJS(gists))));
    };
}

function showGists(gists) {
    const type = Types.SHOW_GISTS;
    return { type, gists };
}

function selectGist(id) {
    return { type: Types.SELECT_GIST, id };
}
