import React, { Component } from "react";

export default class GistDetails extends Component {
    render() {
        var { title, files } = this.props;
        if (!files) {
            return (
                <section />
            );
        }

        return (
            <section>
                <h1>{ title }</h1>
                <ol>
                    { files.map(file => (
                        <li key={ file.name } >{ file.name }</li>
                    )) }
                </ol>
            </section>
        );
    }
}