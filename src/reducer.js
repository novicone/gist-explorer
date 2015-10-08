import { List, Record } from "immutable";

import { Types } from "./Actions";

const AppStateRecord = Record({ api: null, gists: null, selectedGist: null });
const defaultState = AppStateRecord();

export default function reducer(state = defaultState, action) {
    switch(action.type) {
        case Types.SHOW_GISTS_VIEW:
            return state.set("api", action.api);
        case Types.SHOW_GISTS:
            const { gists } = action;
            return state.merge({
                gists: gists,
                selectedGist: gists.get(0).get("id")
            });
        case Types.SELECT_GIST:
            return state.set("selectedGist", action.id);
        default:
            return state;
    }
}