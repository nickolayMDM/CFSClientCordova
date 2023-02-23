import React, {Component} from 'react';

class ModalBody extends Component {
    getClassName() {
        let classNameString = "modal-body";
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

export default ModalBody;