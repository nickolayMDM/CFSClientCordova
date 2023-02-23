import React, {Component} from 'react';

class DropdownSelect extends Component {
    getClassName() {
        let classNameString = "input dropdown-select";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <select {...this.props} className={this.getClassName()} />
        );
    }
}

export default DropdownSelect;