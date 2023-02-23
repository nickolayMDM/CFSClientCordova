import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import Scene from "../commons/Scene";

const sceneName = "upgradeSuccessful";

class UpgradeScene extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    render() {
        return (
            <Scene name={sceneName} options={{}} className="upgrade">
                <p>{translate("Thanks, dood.", "Texts")}</p>
            </Scene>
        );
    }
}

export default UpgradeScene;