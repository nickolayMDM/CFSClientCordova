import React, {Component} from 'react';
import eventEmitter from "../../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import validators from "../../../helpers/validators";

import Svg from "../../commons/Svg";

import moveImage from "../../../images/CardList/moveto.svg";

class MoveButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    openMoveModal() {
        eventEmitter.emit("movePost", this.props.item);

        if (typeof this.props.callback === "function") {
            this.props.callback();
        }
    }

    _renderMoveIcon() {
        if (this.props.hideIcon === true) {
            return "";
        }

        return (
            <Svg src={moveImage} width="17" height="17"/>
        );
    }

    _renderMoveText() {
        if (this.props.hideText === true) {
            return "";
        }

        return (
            <p>
                {translate("Move", "Actions")}
            </p>
        );
    }

    getClassName() {
        let className = "move-button";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <button className={this.getClassName()} onClick={this.openMoveModal.bind(this)}>
                {this._renderMoveIcon()}
                {this._renderMoveText()}
            </button>
        );
    }
}

export default MoveButton;