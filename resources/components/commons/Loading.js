import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

import "../../styles/commons/Loading.scss";

/**
 * props:
 * className
 */
class Loading extends Component {
    getClassName() {
        let classNameArray = ["icon loading"];
        if (typeof this.props.className === "string") {
            classNameArray.push(this.props.className);
        }
        const classNameString = classNameArray.join(" ");

        return classNameString;
    }

    render() {
        return (
            <FontAwesomeIcon className={this.getClassName()} icon={faSpinner} size={this.props.size} />
        );
    }
}

export default Loading;