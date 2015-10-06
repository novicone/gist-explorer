
(function() {
    var GITHUB_API_URL = "https://api.github.com/user";
    var display = createDisplay();

    start();

    function start() {
        display.showLoginPrompt();
    }

    function authenticate(login, password) {
        var credentials = {
            login: login, 
            password: password
        };

        initializeApi(GITHUB_API_URL, credentials).then(function (api) {
            if (api) {
                display.showGists(api);
            } else {
                display.showLoginPrompt();
            }
        });
    }

    function createDisplay() {
        return {
            showLoginPrompt: function() {
                var credentialsArray = prompt("provide your github login:password").split(":");
                authenticate(credentialsArray[0], credentialsArray[1]);
            },
            showGists: function(api) {
                api.getGists().then(function (gists) {
                    console.log(gists);
                });
            }
        };
    }

    function initializeApi(url, credentials) {
        return fetchAuthorized(url, null, credentials).then(function (user) {
            return createApi(user, function (url, request) {
                return fetchAuthorized(url, request, credentials);
            });
        }).catch(function () {
            return null;
        });
    }

    function fetchAuthorized(url, request, credentials) {
        return fetch(url, Object.assign(request || {}, {
            headers: {
                Authorization: "Basic " + btoa(credentials.login + ":" + credentials.password)
            }
        })).then(function (response) {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        });
    }

    function createApi(user, fetch) {
        function makeUrl(name, parameters) {
            parameters = parameters || {};
            var template = user[name];
            return template.replace(/{\/(\w+)}/, function(match, paramName) {
                return parameters[paramName] || "";
            });
        }

        return {
            getGists: function() {
                return fetch(makeUrl("gists_url"));
            }
        };
    }

})();