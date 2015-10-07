import React, { Component } from "react";

import GistsList from "./GistsList";
import GistDetails from "./GistDetails";

export default class GistsView {
    render() {
        return (
            <main>
                <GistsList { ...this.props } />
                <GistDetails { ...this.props.selectedGist } />
            </main>
        );
    }
}