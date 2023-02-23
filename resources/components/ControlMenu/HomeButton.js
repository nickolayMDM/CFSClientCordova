import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import folderProvider from "../../providers/folderProvider";

import Svg from "../commons/Svg";

import homeImage from "../../images/ControlMenu/home.svg";

class HomeButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    gotoHome() {
        folderProvider.switchToRoot();
    }

    render() {
        return (
            <div className="home-button" onClick={this.gotoHome}>
                <Svg src={homeImage} width="28" height="25" />
                <p className="description-text">{translate("Home", "Actions")}</p>
            </div>
        );
    }
}

export default HomeButton;