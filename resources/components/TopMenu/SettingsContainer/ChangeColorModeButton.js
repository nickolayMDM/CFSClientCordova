import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";
import colorModeProvider from "../../../providers/colorModeProvider";
import accountProvider from "../../../providers/accountProvider";

import Svg from "../../commons/Svg";

import colorModeImage from "../../../images/TopMenu/colorMode.svg";

class ChangeColorModeButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        accountProvider.applyAccountUpdates(this);
        colorModeProvider.applyColorModeUpdates(this);
    }

    switchColorMode() {
        if (colorModeProvider.getCurrentColorMode() === "bright") {
            return colorModeProvider.switchTo({
                name: "dark",
                userSubscriptionType: accountProvider.getSubscriptionType()
            });
        }

        return colorModeProvider.switchTo({
            name: "bright",
            userSubscriptionType: accountProvider.getSubscriptionType()
        });


    }

    handleClick() {
        this.switchColorMode();

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={colorModeImage} width="16" height="16"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        if (colorModeProvider.getCurrentColorMode() === "bright") {
            return (
                <p>
                    {translate("Dark mode", "Settings")}
                </p>
            );
        }

        return (
            <p>
                {translate("Bright mode", "Settings")}
            </p>
        );
    }

    getClassName() {
        let className = "change-color-mode-button";
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

export default ChangeColorModeButton;