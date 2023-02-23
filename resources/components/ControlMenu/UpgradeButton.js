import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import sceneProvider from "../../providers/sceneProvider";
import modalProvider from "../../providers/modalProvider";
import accountProvider from "../../providers/accountProvider";
import validators from "../../helpers/validators";

import Svg from "../commons/Svg";

import upgradeImage from "../../images/ControlMenu/upgrade.svg";

class UpgradeButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        accountProvider.applyAccountUpdates(this);
    }

    openUpgradeModal() {
        const status = accountProvider.getStatus();
        if (
            validators.isDefined(status)
            && status !== "guest"
        ) {
            return sceneProvider.switchToScene({
                name: "upgrade"
            });
        }

        modalProvider.switchToModal({
            name: "LogIn",
            options: {
                callback: () => {
                    console.log("switchToModal");
                    sceneProvider.switchToScene({name: "upgrade"});
                }
            }
        });
    }

    render() {
        return (
            <div className="upgrade-button" onClick={this.openUpgradeModal.bind(this)}>
                <div className="image-wrapper">
                    <p className="highlighted-icon-text">{translate("Pro", "General")}</p>
                    <Svg src={upgradeImage} width="27" height="27" />
                </div>
                <p className="description-text">{translate("Upgrade", "Actions")}</p>
            </div>
        );
    }
}

export default UpgradeButton;