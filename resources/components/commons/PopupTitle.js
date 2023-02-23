import React, {Component} from 'react';

import "../../styles/commons/PopupTitle.scss";

const fadeStates = {
    active: "active transition",
    fade: "fade transition",
    hidden: "hidden"
};

class PopupTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeState: fadeStates.hidden
        };
        this.fadeTimeout = 0;
        this.fadeSpeedMS = 300;
    }

    componentDidMount() {
        if (this.props.display === true) {
            this.fadeIn();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.display === true && prevProps.display !== true && this.state.fadeState !== fadeStates.active) {
            this.fadeIn();
        } else if (this.props.display === false && prevProps.display !== false && this.state.fadeState !== fadeStates.hidden) {
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
        let classNameString = "popup-title " + this.state.fadeState;
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

export default PopupTitle;