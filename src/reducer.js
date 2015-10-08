import { List, Record } from "immutable";

var AppStateRecord = Record({ api: null, gists: List(), selectedGist: null });

export default function reducer(state = AppStateRecord(), action) {
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