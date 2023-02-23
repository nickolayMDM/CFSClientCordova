import React, {Component} from 'react';
import serverRequester from "../../../adapters/serverRequesterAdapter";
import eventEmitter from "../../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";
import storage from "../../../adapters/storageAdapter";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

class LogOutButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    async logOut() {
        const staticAuthString = "";
        await storage.set({
            key: "appUserString",
            value: staticAuthString
        });

        const requestResult = await serverRequester.authorize();
        if (typeof requestResult.response.newUserString === "string") {
            await storage.set({
                key: "appUserString",
                value: requestResult.response.newUserString
            });
        }

        eventEmitter.emit("refreshUserData");
        eventEmitter.emit("refreshCardList");

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <FontAwesomeIcon icon={faSignOutAlt}/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        return (
            <p>
                {translate("Log out", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "log-out-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.logOut.bind(this)}>
                {this._renderPinIcon()}
                {this._renderPinText()}
            </button>
        );
    }
}

export default LogOutButton;