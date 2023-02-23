import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import TextInput from "../commons/Input/TextInput";

import "../../styles/ControlMenu/SearchInput.scss";

import {faTimes} from '@fortawesome/free-solid-svg-icons'

const performSearchDelayMS = 500;

class SearchInput extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        this.clearState = {
            searchQuery: "",
            active: false
        };
        this.state = this.clearState;

        this.containerRef = React.createRef();
        this.performSearchTimeoutID = 0;

        eventEmitter.addListener("toggleSearchInput", this.clearInput.bind(this));
        eventEmitter.addListener("moveFolder", this.setClearState.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.active && this.state.searchQuery !== prevState.searchQuery) {
            clearTimeout(this.performSearchTimeoutID);
            if (this.state.searchQuery.length > 2) {
                this.performSearchTimeoutID = setTimeout(this.performSearch.bind(this), performSearchDelayMS);
            } else {
                this.performSearchTimeoutID = setTimeout(() => {
                    eventEmitter.emit("refreshCardList");
                }, performSearchDelayMS);
            }
        }
    }

    toggleComponent() {
        eventEmitter.emit("toggleSearchInput");
    }

    clearInput() {
        this.setState({
            searchQuery: ""
        });
    }

    setClearState() {
        this.setState(this.clearState);
    }

    handleSearchTextChange(event) {
        if (!this.state.active) {
            return;
        }

        this.setState({
            searchQuery: event.target.value
        });
    }

    performSearch() {
        eventEmitter.emit("performSearch", this.state.searchQuery);
    }

    activateSearchInput() {
        this.setState({
            active: true
        });
    }

    disableSearchInput() {
        this.setState({
            active: false
        });
    }

    render() {
        return (
            <div ref={this.containerRef} className="search-input">
                <TextInput onChange={this.handleSearchTextChange.bind(this)}
                           onFocus={this.activateSearchInput.bind(this)}
                           onBlur={this.disableSearchInput.bind(this)}
                           value={this.state.searchQuery}
                           placeholder={translate("Your query here...", "Form")}
                           name="searchInput"
                           autoComplete="off"/>
                <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={this.toggleComponent.bind(this)}/>
            </div>
        );
    }
}

export default SearchInput;