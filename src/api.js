export { initializeApi };

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

function createApi(userObject, fetch) {
    function makeUrl(name, parameters = {}) {
        var template = userObject[name];
        return template.replace(/{\/(\w+)}/, (match, paramName) => (parameters[paramName] || ""));
    }

    return {
        getGists() {
            return fetch(makeUrl("gists_url"));
        }
    };
}