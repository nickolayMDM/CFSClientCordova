import React, {Component} from 'react';
import eventEmitter from "../../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";

import Svg from "../../commons/Svg";

import editImage from "../../../images/CardList/edit.svg";

class SetNoteButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    handleClick() {
        if (validators.isFunction(this.props.customNoteAction)) {
            return this.props.customNoteAction();
        }

        this.openSetNoteModal();
    }

    openSetNoteModal() {
        eventEmitter.emit("openSetNoteModal", this.props.item);

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={editImage} width="17" height="17"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        if (!validators.isString(this.props.item.note) || this.props.item.note.length <= 0) {
            return (
                <p>
                    {translate("Add a Note", "Actions")}
                </p>
            );
        }

        return (
            <p>
                {translate("Change Note", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "set-note-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button type="button" className={this.getClassName()} onClick={this.handleClick.bind(this)}>
                {this._renderPinIcon()}
                {this._renderPinText()}
            </button>
        );
    }
}

export default SetNoteButton;