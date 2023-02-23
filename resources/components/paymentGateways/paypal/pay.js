import React, {Component} from 'react';
import scriptLoader from "../../../adapters/scriptLoaderAdapter";
import serverRequester from "../../../adapters/serverRequesterAdapter";
import sceneProvider from "../../../providers/sceneProvider";
import accountProvider from "../../../providers/accountProvider";
import config from "../../../config";
import validators from "../../../helpers/validators";

class PaypalGatewayPay extends Component {
    componentDidMount() {
        this.loadScript();
    }

    loadScript() {
        scriptLoader.loadScript({
            path: "https://www.paypal.com/sdk/js?client-id=" + config.paymentData.paypal.clientID + "&enable-funding=venmo&currency=" + this.props.currency,
            callback: this.initPaypal.bind(this)
        });
    }

    initPaypal() {
        const props = this.props;
        paypal.Buttons({
            style: {
                shape: props.shape,
                color: props.color,
                layout: props.layout,
                label: props.label,
            },

            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{"amount":{"currency_code":props.currency,"value":props.value}}]
                });
            },

            onApprove: function(data, actions) {
                return actions.order.capture().then(async function(orderData) {
                    // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                    const requestResult = await serverRequester.payForPremium({
                        status: orderData.status,
                        details: orderData
                    });
                    accountProvider.setFromObject(requestResult.response.user);

                    sceneProvider.switchToScene({
                        name: "upgradeSuccessful"
                    })
                });
            },

            onError: function(err) {
                console.log(err);
            }
        }).render('#paypal-gateway-pay');
    }

    getClassName() {
        let className = "paypal-gateway-pay";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        return (
            <div id="paypal-gateway-pay" className={this.getClassName()} />
        );
    }
}

export default PaypalGatewayPay;