import React, {Component} from 'react';
import modalProvider from "../../providers/modalProvider";

import "../../styles/commons/Modal.scss";

const fadeStates = {
    active: "active transition",
    fade: "fade transition",
    hidden: "hidden"
};

/**
 * props:
 * name
 * options (check ModalProvider for available options)
 */
class Modal extends Component {
    constructor(props) {
        super(props);

        modalProvider.applyModalUpdates(this);

        this.state = {
            fadeState: fadeStates.hidden
        };
        this.fadeTimeout = 0;
        this.fadeSpeedMS = 300;

        modalProvider.defineModal(this.props.name, this.props.options);
    }

    componentDidUpdate() {
        if (modalProvider.getCurrentModalName() === this.props.name && this.state.fadeState === fadeStates.hidden) {
            this.fadeIn();
        } else if (modalProvider.getCurrentModalName() !== this.props.name && this.state.fadeState === fadeStates.active) {
            this.fadeOut();
        }
    }

    clearFadeTimeout() {
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = 0;
    }

    fadeOut() {
        this.clearFadeTimeout();

        this.setState({
            fadeState: fadeStates.fade
        });

        this.fadeTimeout = setTimeout(function() {
            this.setState({
                fadeState: fadeStates.hidden
            });
        }.bind(this), this.fadeSpeedMS);
    }

    fadeIn() {
        this.clearFadeTimeout();

        this.setState({
            fadeState: fadeStates.fade
        });

        this.fadeTimeout = setTimeout(() => {
            this.setState({
                fadeState: fadeStates.active
            });
        }, 0);
    }

    getClassName() {
        let classNameString = "modal modal-" + this.props.name + " " + this.state.fadeState;
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }
}

export default Modal;