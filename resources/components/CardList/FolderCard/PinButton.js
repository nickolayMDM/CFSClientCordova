import React, {Component} from 'react';
import serverRequester from "../../../adapters/serverRequesterAdapter";
import eventEmitter from "../../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";

import Svg from "../../commons/Svg";

import pinImage from "../../../images/CardList/pin.svg";
import pinFilledImage from "../../../images/CardList/pinFilled.svg";

class PinButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    async togglePin() {
        await serverRequester.setFolderPin({
            folder: this.props.ID,
            pin: (this.props.isPinned) ? 0 : 1
        });

        eventEmitter.emit("refreshCardList");

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        if (this.props.isPinned) {
            return (
                <Svg src={pinFilledImage} width="17" height="17"/>
            );
        }

        return (
            <Svg src={pinImage} width="17" height="17"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        if (this.props.isPinned) {
            return (
                <p>
                    {translate("Unpin", "Actions")}
                </p>
            );
        }

        return (
            <p>
                {translate("Pin", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "pin-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.togglePin.bind(this)}>
                {this._renderPinIcon()}
                {this._renderPinText()}
            </button>
        );
    }
}

export default PinButton;