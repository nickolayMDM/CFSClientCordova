import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'

import BaseInput from "./BaseInput";

class PasswordInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: "password"
        };

        this.baseRef = React.createRef();
    }

    getClassName() {
        let classNameString = "input password-input";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    toggleType(event) {
        event.preventDefault();

        if (this.state.type === "password") {
            return this.setTextType();
        }

        return this.setPasswordType();
    }

    setPasswordType() {
        this.setState({
            type: "password"
        });
    }

    setTextType() {
        this.setState({
            type: "text"
        });
    }

    renderButton() {
        let icon = faEye;
        if (this.state.type === "text") {
            icon = faEyeSlash;
        }

        return (
            <button onClick={this.toggleType.bind(this)}>
                <FontAwesomeIcon icon={icon}/>
            </button>
        );
    }

    render() {
        return (
            <div className={this.getClassName()}>
                <BaseInput {...this.props} ref={this.baseRef} type={this.state.type} className=""/>
                {this.renderButton()}
            </div>
        );
    }
}

export default PasswordInput;