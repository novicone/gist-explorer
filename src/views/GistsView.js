import React, { Component } from "react";

export default class GistsView {
    componentDidMount() {
        this.props.loadGists();
    }
    render() {
        var { gists } = this.props;
        if (!gists) {
            return (<div>No gists...</div>);
        }
        return (
            <ul>
                { gists.map(gist => <li><pre>{ JSON.stringify(gist, null, 2) }</pre></li>) }
            </ul>
        );
    }
}