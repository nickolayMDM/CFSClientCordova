import React, {Component} from 'react';
import validators from "../helpers/validators";

import "../styles/ContextMenu.scss";

class ContextMenu extends Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
    }

    getClassName() {
        let classNameArray = [
            "context-menu"
        ];

        if (validators.isPopulatedString(this.props.className)) {
            classNameArray.push(this.props.className);
        }
        if (this.props.displayed === false || typeof this.props.displayed === "undefined") {
            classNameArray.push("hidden");
        }

        return classNameArray.join(" ");
    }

    render() {
        return (
            <div ref={this.containerRef} className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }
}

export default ContextMenu;