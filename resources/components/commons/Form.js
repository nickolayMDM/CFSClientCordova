import React, {Component} from 'react';
import validators from "../../helpers/validators";

import "../../styles/commons/Form.scss";

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        if (validators.isFunction(this.props.preparation)) {
            this.props.preparation();
        }
        setTimeout(() => {
            if (validators.isFunction(this.props.validator) && !this.props.validator()) {
                this.setState({
                    error: true
                });
                return false;
            }
            if (validators.isFunction(this.props.handler)) {
                this.props.handler();
            }
        }, 0);
    }

    getClassName() {
        let classNameString = "form";
        if (this.state.error) {
            classNameString += " form-error";
        }
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} className={this.getClassName()} onFocus={this.props.onClick}>
                {this.props.children}
            </form>
        );
    }
}

export default Form;