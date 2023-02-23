import React, {Component} from 'react';
import eventEmitter from "../../../adapters/eventAdapter";
import validators from "../../../helpers/validators";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";

import Svg from "../../commons/Svg";

import editImage from "../../../images/CardList/edit.svg";

class RenameButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    openRenameModal() {
        eventEmitter.emit("renameFolder", this.props.item);

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={editImage} width="17" height="17"/>
        );
    }

    _renderText() {
        if (this.props.hideText === true) {
            return "";
        }

        return (
            <p>
                {translate("Rename", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "rename-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.openRenameModal.bind(this)}>
                {this._renderIcon()}
                {this._renderText()}
            </button>
        );
    }
}

export default RenameButton;