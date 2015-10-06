const GITHUB_API_URL = "https://api.github.com/user";
var display = createDisplay();

start();

function start() {
    display.showLoginPrompt();
}

function authenticate(login, password) {
    var credentials = { login, password };

    initializeApi(GITHUB_API_URL, credentials).then(api => {
        if (api) {
            display.showGists(api);
        } else {
            display.showLoginPrompt();
        }
    });
}

function createDisplay() {
    return {
        showLoginPrompt() {
            var credentialsArray = prompt("provide your github login:password").split(":");
            authenticate(...credentialsArray);
        },
        showGists(api) {
            api.getGists().then(gists => console.log(gists));
        }
    };
}

function initializeApi(url, credentials) {
    return fetchAuthorized(url, null, credentials).then(user => {
        return createApi(user, (url, request) => {
            return fetchAuthorized(url, request, credentials);
        });
    }).catch(() => null);
}

function fetchAuthorized(url, request, credentials) {
    var {login, password} = credentials;
    return fetch(url, Object.assign(request || {}, {
        headers: {
            Authorization: "Basic " + btoa(login + ":" + password)
        }
    })).then(response => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    });
}

function createApi(user, fetch) {
    function makeUrl(name, parameters = {}) {
        var template = user[name];
        return template.replace(/{\/(\w+)}/, (match, paramName) => (parameters[paramName] || ""));
    }

    return {
        getGists() {
            return fetch(makeUrl("gists_url"));
        }
    };
}