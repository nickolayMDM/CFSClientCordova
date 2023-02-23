import React, {Component} from 'react';
import {applyTranslationUpdates, getCurrentLocale} from "../adapters/translatorAdapter";
import colorModeProvider from "../providers/colorModeProvider";

class AppContainer extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        colorModeProvider.applyColorModeUpdates(this);

        this.state = {
            lastColorMode: colorModeProvider.getCurrentColorMode(),
            colorMode: colorModeProvider.getCurrentColorMode(),
            isSwitching: false
        };

        this.switchTimeout = -1;
        this.switchTimeoutTime = 300;
        this.newColorModeTimeout = -1;
    }

    componentDidUpdate() {
        if (this.state.lastColorMode !== colorModeProvider.getCurrentColorMode()) {
            this.initiateSwitch();
        }
    }

    initiateSwitch() {
        clearTimeout(this.switchTimeout);
        clearTimeout(this.newColorModeTimeout);

        this.setState({
            lastColorMode: colorModeProvider.getCurrentColorMode(),
            isSwitching: true
        });

        this.newColorModeTimeout = setTimeout(this.setNewColorMode.bind(this), 0);
        this.switchTimeout = setTimeout(this.endSwitch.bind(this), this.switchTimeoutTime);
    }

    setNewColorMode() {
        this.setState({
            colorMode: colorModeProvider.getCurrentColorMode()
        });
    }

    endSwitch() {
        this.setState({
            isSwitching: false
        });
    }

    getClassName() {
        let classNameString = "app-mode-" + this.state.colorMode + " app-language-" + getCurrentLocale();
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }
        if (this.state.isSwitching) {
            classNameString += " switching-modes";
        }

        return classNameString;
    }

    render() {
        return (
            <div id="app" className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }
}

export default AppContainer;