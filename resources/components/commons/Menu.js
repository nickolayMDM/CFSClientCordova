import React, {Component} from 'react';
import validators from "../../helpers/validators";

import "../../styles/commons/Menu.scss";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false
        };

        this.containerRef = React.createRef();
        this.bindedMenuOuterClickEventHandler = this.menuOuterClickEventHandler.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isMenuOpen !== this.state.isMenuOpen) {
            this.toggleMenuOuterClickEvent();
        }
    }

    toggleMenuOuterClickEvent() {
        if (this.state.isMenuOpen === true) {
            return this.activateMenuOuterClickEvent();
        }

        return this.disableMenuOuterClickEvent();
    }

    toggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    }

    getInnerReference() {
        if (validators.isObject(this.props.containerRef)) {
            return this.props.containerRef;
        }

        return this.containerRef;
    }

    menuOuterClickEventHandler(event) {
        let isInsideMenu = false;
        for (let key in event.path) {
            if (event.path[key] === this.getInnerReference().current) {
                isInsideMenu = true;
                break;
            }
        }
        if (isInsideMenu) {
            return;
        }

        this.toggleMenu();
    }

    activateMenuOuterClickEvent() {
        const handler = this.bindedMenuOuterClickEventHandler;
        setTimeout(() => {
            document.addEventListener("touchstart", handler);
            document.addEventListener("mousedown", handler);
            document.addEventListener("click", handler);
        }, 0);
    }

    disableMenuOuterClickEvent() {
        const handler = this.bindedMenuOuterClickEventHandler;
        setTimeout(() => {
            document.removeEventListener("touchstart", handler);
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("click", handler);
        }, 0);
    }

    getClassName() {
        let classNameArray = [
            "menu"
        ];

        if (validators.isPopulatedString(this.props.className)) {
            classNameArray.push(this.props.className);
        }
        if (this.state.isMenuOpen === false || typeof this.state.isMenuOpen === "undefined") {
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

export default Menu;