import React, {Component} from 'react';

import BaseInput from "./BaseInput";

class TextInput extends Component {
    constructor(props) {
        super(props);

        this.baseRef = React.createRef();
    }

    getClassName() {
        let classNameString = "text-input";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <BaseInput type="text" {...this.props} ref={this.baseRef} className={this.getClassName()} />
        );
    }
}

export default TextInput;