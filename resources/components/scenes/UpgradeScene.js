import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import Scene from "../commons/Scene";
import PaypalGatewayPay from "./../paymentGateways/paypal/pay";

import "../../styles/scenes/UpgradeScene.scss";

const sceneName = "upgrade";

class UpgradeScene extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    render() {
        return (
            <Scene name={sceneName} options={{}} className="upgrade">
                <p>{translate("Bla bla bla this is a test payment page. It costs 5 bucks, get over it.", "Texts")}</p>
                <PaypalGatewayPay
                    value={5}
                    currency="USD"
                    shape="pill"
                    color="blue"
                    layout="vertical"
                    label="pay"
                />
            </Scene>
        );
    }
}

export default UpgradeScene;