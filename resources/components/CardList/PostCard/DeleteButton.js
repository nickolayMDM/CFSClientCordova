import React, {Component} from 'react';
import eventEmitter from "../../../adapters/eventAdapter";
import validators from "../../../helpers/validators";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";

import Svg from "../../commons/Svg";

import deleteImage from "../../../images/CardList/delete.svg";

class DeleteButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    openDeleteModal() {
        eventEmitter.emit("deletePost", this.props.ID);

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderPinIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={deleteImage} width="17" height="17"/>
        );
    }

    _renderPinText() {
        if (this.props.hideText === true) {
            return "";
        }

        return (
            <p>
                {translate("Delete", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "delete-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.openDeleteModal.bind(this)}>
                {this._renderPinIcon()}
                {this._renderPinText()}
            </button>
        );
    }
}

export default DeleteButton;