import React, {Component} from 'react';

import Menu from "../commons/Menu";
import LogOutButton from "./SettingsContainer/LogOutButton";
import ChangeColorModeButton from "./SettingsContainer/ChangeColorModeButton";
import ChangeSortingOptionButton from "./SettingsContainer/ChangeSortOptionButton";
import ChangeLanguageButton from "./SettingsContainer/ChangeLanguageButton";
import Svg from "../commons/Svg";

import menuImage from "../../images/TopMenu/menu.svg";

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false
        };

        this.containerRef = React.createRef();
        this.menuRef = React.createRef();
    }

    toggleMenu() {
        this.menuRef.current.toggleMenu();
    }

    getSettingsList() {
        let key = 0;
        let result = [];
        result.push(<ChangeLanguageButton key={key} callback={this.toggleMenu.bind(this)}
                                           className="button-link button-link-black button-contained"/>);
        key++;

        result.push(<ChangeSortingOptionButton key={key} callback={this.toggleMenu.bind(this)}
                                           className="button-link button-link-black button-contained"/>);
        key++;

        if (this.props.userSubscriptionType === "premium") {
            result.push(<ChangeColorModeButton key={key} callback={this.toggleMenu.bind(this)}
                                               className="button-link button-link-black button-contained"/>);
            key++;
        }
        if (this.props.userStatus !== "guest") {
            result.push(<LogOutButton key={key} callback={this.toggleMenu.bind(this)}
                                      className="button-link button-link-black button-contained"/>);
            key++;
        }

        return result;
    }

    render() {
        return (
            <div ref={this.containerRef} className="settings-container">
                <div className="settings-button" onClick={this.toggleMenu.bind(this)}>
                    <Svg src={menuImage} width="30" height="30"/>
                </div>
                <Menu ref={this.menuRef} containerRef={this.containerRef} className="settings-menu">
                    {this.getSettingsList()}
                </Menu>
            </div>
        );
    }
}

export default SettingsContainer;