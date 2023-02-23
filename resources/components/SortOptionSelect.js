import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../adapters/translatorAdapter";
import validators from "../helpers/validators";
import sortOptionProvider from "../providers/sortOptionProvider";
import eventEmitter from "../adapters/eventAdapter";

import DropdownSelect from "./commons/DropdownSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

import "../styles/SortOptionSelect.scss";

class SortOptionSelect extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        sortOptionProvider.applySortOptionUpdates(this);

        this.state = {
            activeOption: false
        };
    }

    componentDidUpdate() {
        const currentSortOption = sortOptionProvider.getCurrentSortOption();
        if (currentSortOption !== this.state.activeOption) {
            this.setState({
                activeOption: currentSortOption
            });
        }
    }

    handleSelectChange(event) {
        this.setState({
            activeOption: event.target.value
        });

        sortOptionProvider.switchTo({name: event.target.value});
        const eventName = (validators.isPopulatedString(this.props.changeEventName)) ? this.props.changeEventName : "refreshCardList";
        eventEmitter.emit(eventName);
    }

    getClassName() {
        let className = "sort-option-select";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    getOptions() {
        const sortOptions = sortOptionProvider.getSortOptions();
        let options = [];
        let iterator = 0;

        for (let key in sortOptions) {
            options.push(<option key={iterator} value={key}>{translate(sortOptions[key].title, "General")}</option>);
            iterator++;
        }

        return options;
    }

    render() {
        return (
            <span>
                <FontAwesomeIcon icon={faSignOutAlt}/>
                <DropdownSelect onChange={this.handleSelectChange.bind(this)} value={this.state.activeOption}>
                    {this.getOptions()}
                </DropdownSelect>
            </span>
        );
    }
}

export default SortOptionSelect;