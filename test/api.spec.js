import { initializeApi } from "../src/api";
import { expect } from "chai";
import sinon from "sinon";

describe("api", () => {
    let originalFetch;

    before(() => {
        originalFetch = global.fetch;
    });

    beforeEach(() => {
        global.fetch = sinon.stub();
    });

    after(() => {
        global.fetch = originalFetch;
    });

    const ENDPOINT = "http://example.com/api";
    const CREDENTIALS = { login: "user", password: "pass123" };
    const AUTHORIZATION_HEADERS = { Authorization: "Basic dXNlcjpwYXNzMTIz" };

    describe("initialization", () => {
        it("calls the given url with HTTP Basic authorization headers", () => {
            fetch.returns(Promise.reject());

            initializeApi(ENDPOINT, CREDENTIALS);

            sinon.assert.calledWithMatch(fetch, ENDPOINT, { headers: AUTHORIZATION_HEADERS });
        });

        it("promises an api object if the endpoint responds with a user object", () => {
            fetch.returns(Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ })
            }));

            return initializeApi(ENDPOINT, CREDENTIALS).then((api) => {
                expect(api).to.be.an("object");
            });
        });

        it("promises `null` if the endpoint responds with an error status", () => {
            fetch.returns(Promise.resolve({
                ok: false
            }));

            return initializeApi(ENDPOINT, CREDENTIALS).then((api) => {
                expect(api).to.be.null;
            });
        });
    });

    describe("call", () => {
        const ENDPOINT_NAME = "endpoint";
        let api;

        beforeEach(() => {
            fetch.returns(Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    endpoint: ENDPOINT + "/this_is_an_endpoint{/param1}{/param2}"
                })
            }));       
            return initializeApi(ENDPOINT, CREDENTIALS).then((initializedApi) => {
                api = initializedApi;
                fetch.reset();
            });
        });

        it("authorizes with credentials provided during initialization", () => {
            api.call(ENDPOINT_NAME);
            sinon.assert.calledWith(fetch, sinon.match.any, sinon.match({ headers: AUTHORIZATION_HEADERS }));
        });

        it("calls endpoints configured by initialization object", () => {
            api.call(ENDPOINT_NAME);
            sinon.assert.calledWithMatch(fetch, ENDPOINT + "/this_is_an_endpoint");
        });

        it("builds endpoint's URL as configured", () => {
            api.call(ENDPOINT_NAME, { param1: "foo" });
            sinon.assert.calledWithMatch(fetch, ENDPOINT + "/this_is_an_endpoint/foo");

            fetch.reset();
            api.call(ENDPOINT_NAME, { param1: "foo", param2: "bar" });
            sinon.assert.calledWithMatch(fetch, ENDPOINT + "/this_is_an_endpoint/foo/bar");
        });

        it("promises a value returned by the endpoint", () => {
            fetch.returns(Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ foo: "bar" })
            }));

            return api.call(ENDPOINT_NAME).then((value) => {
                expect(value).to.deep.equal({ foo: "bar" });
            });
        });

        it("rejects the promise when an endpoint responds with an error status", () => {
            fetch.returns(Promise.resolve({
                ok: false
            }));

            const rejectionHandler = sinon.spy();

            return api.call(ENDPOINT_NAME).catch(rejectionHandler).then(() => {
                sinon.assert.called(rejectionHandler);
            });
        });
    });
});