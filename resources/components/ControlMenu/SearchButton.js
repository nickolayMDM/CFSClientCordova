import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import eventEmitter from "../../adapters/eventAdapter";

import Svg from "../commons/Svg";

import searchImage from "../../images/ControlMenu/search.svg";

class SearchButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    showSearchBar() {
        eventEmitter.emit("toggleSearchInput");
    }

    render() {
        return (
            <div className="search-button" onClick={this.showSearchBar}>
                <Svg src={searchImage} width="24" height="24" />
                <p className="description-text">{translate("Search", "Actions")}</p>
            </div>
        );
    }
}

export default SearchButton;