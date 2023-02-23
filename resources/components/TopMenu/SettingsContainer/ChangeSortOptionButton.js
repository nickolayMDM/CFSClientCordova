import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";
import sortOptionProvider from "../../../providers/sortOptionProvider";
import modalProvider from "../../../providers/modalProvider";

import Svg from "../../commons/Svg";

import sortOptionImage from "../../../images/TopMenu/sortOption.svg";

class ChangeSortOptionButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        sortOptionProvider.applySortOptionUpdates(this);

        this.state = {
            isListOpen: false
        };
    }

    openSortOptionModal() {
        modalProvider.switchToModal({
            name: "ChooseSortOption"
        })
    }

    handleClick() {
        this.openSortOptionModal();

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={sortOptionImage} width="16" height="16"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }
        return (
            <p>
                {translate("Sorting", "Settings")}
            </p>
        );
    }

    getClassName() {
        let className = "change-sort-option-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.handleClick.bind(this)}>
                {this._renderPinIcon()}
                {this._renderPinText()}
            </button>
        );
    }
}

export default ChangeSortOptionButton;