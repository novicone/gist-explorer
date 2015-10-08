import React, { Component } from "react";

export default class GistsList extends Component {
    render() {
        var { gists, selectGist } = this.props;

        if (gists.length === 0) {
            return (<span>No gists yet</span>);
        }
        return (
            <ul>
                { gists.map(gist => 
                    <GistsListItem key={ gist.id } title={ gist.title } selected={ gist.selected } onClick={ () => selectGist(gist.id) } />
                ) }
            </ul>
        );
    }
}

class GistsListItem extends Component {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }
    _onClick(e) {
        e.preventDefault();
        this.props.onClick();
    }
    render() {
        var { title, selected } = this.props;
        return (
            <li>
                <a onClick={ this._onClick } className={ selected && "selected" }>{ title }</a>
            </li>
        );
    }
}