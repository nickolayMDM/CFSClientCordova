import React, {Component} from 'react';
import modalProvider from "../../../providers/modalProvider";

import "../../../styles/commons/Modal/ModalBackground.scss";

const fadeStates = {
    active: "active transition",
    fade: "fade transition",
    hidden: "hidden"
};

class ModalBackground extends Component {
    constructor(props) {
        super(props);

        modalProvider.applyModalUpdates(this);

        this.state = {
            fadeState: fadeStates.hidden,
            isActive: false,
            closeModalOnClick: false
        };
        this.fadeTimeout = 0;
        this.fadeSpeedMS = 300;
    }

    componentDidUpdate() {
        if (modalProvider.getCurrentModalName() !== null && this.state.isActive === false) {
            this.fadeIn();
        } else if (modalProvider.getCurrentModalName() === null && this.state.isActive === true) {
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
            fadeState: fadeStates.fade,
            isActive: false
        });

        this.fadeTimeout = setTimeout(function () {
            this.setState({
                fadeState: fadeStates.hidden
            });
        }.bind(this), this.fadeSpeedMS);
    }

    fadeIn() {
        this.clearFadeTimeout();
        this.setCurrentModalOptions();

        this.setState({
            fadeState: fadeStates.fade,
            isActive: true
        });

        this.fadeTimeout = setTimeout(() => {
            this.setState({
                fadeState: fadeStates.active
            });
        }, 0);
    }

    setCurrentModalOptions() {
        const currentModalConfig = modalProvider.getCurrentModalConfig();

        this.setState({
            closeModalOnClick: (typeof currentModalConfig.backgroundClose === "boolean") ? currentModalConfig.backgroundClose : true
        });
    }

    getClassName() {
        let classNameString = "modal-background " + this.state.fadeState;
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    handleClick() {
        if (!this.state.closeModalOnClick) {
            return;
        }

        modalProvider.hideModal();
    }

    render() {
        return (
            <div className={this.getClassName()} onClick={this.handleClick.bind(this)}/>
        );
    }
}

export default ModalBackground;