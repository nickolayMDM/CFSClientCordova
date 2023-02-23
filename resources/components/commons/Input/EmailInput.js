import React, {Component} from 'react';
import validators from "../../../helpers/validators";

import BaseInput from "./BaseInput";

class EmailInput extends Component {
    constructor(props) {
        super(props);

        this.baseRef = React.createRef();
    }

    getClassName() {
        let classNameString = "email-input";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <BaseInput type="text" validator={validators.isEmail} {...this.props} ref={this.baseRef} className={this.getClassName()} />
        );
    }
}

export default EmailInput;