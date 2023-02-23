import React, {Component} from 'react';
import {translate, applyTranslationUpdates} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";
import modalProvider from "../../../providers/modalProvider";

import Svg from "../../commons/Svg";

import languageImage from "../../../images/TopMenu/language.svg";

class ChangeLanguageButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    openLanguageModal() {
        modalProvider.switchToModal({
            name: "ChooseLanguage"
        })
    }

    handleClick() {
        this.openLanguageModal();

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={languageImage} width="16" height="16"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        return (
            <p>
                {translate("Language", "General")}
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

export default ChangeLanguageButton;