import { initializeApi } from "../src/api";
import { expect } from "chai";
import sinon from "sinon";

describe("api#initializeApi", () => {
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

    it("calls the given url with HTTP Basic authorization headers", () => {
        fetch.returns(Promise.reject());
        initializeApi("http://example.com/api", { login: "user", password: "pass123" });
        sinon.assert.calledWithMatch(fetch, "http://example.com/api", { headers: { Authorization: "Basic dXNlcjpwYXNzMTIz" } });
    });
});