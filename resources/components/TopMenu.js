import React, {Component} from 'react';
import eventEmitter from "../adapters/eventAdapter";
import folderProvider from "../providers/folderProvider";
import accountProvider from "../providers/accountProvider";
import validators from "../helpers/validators";

import "../styles/TopMenu.scss";

import TopMenuLabel from "./TopMenu/TopMenuLabel";
import SettingsContainer from "./TopMenu/SettingsContainer";
import BackButton from "./TopMenu/BackButton";
import SortOptionSelect from "./SortOptionSelect";

class TopMenu extends Component {
    constructor(props) {
        super(props);

        accountProvider.applyAccountUpdates(this);

        this.state = {
            type: "guest",
            label: "",
            isEmpty: true
        };

        eventEmitter.addListener("refreshTopMenuLabel", (payload) => {
            this.setLabelData(payload);
        });
    }

    componentDidMount() {
        this.setLabelData();
    }

    setLabelData(payload) {
        if (!validators.isDefined(payload)) {
            payload = {};
        }

        if (validators.isPopulatedString(payload.override)) {
            if (payload.override === "search") {
                return this.setState({
                    type: "search",
                    label: payload.override
                });
            }

            return this.setState({
                type: "override",
                label: payload.override
            });
        }

        if (!validators.isNull(folderProvider.getCurrentId())) {
            let newState = {
                type: "folder",
                label: folderProvider.getCurrent().name
            };
            if (validators.isBoolean(payload.isEmpty)) {
                newState.isEmpty = payload.isEmpty;
            }

            return this.setState(newState);
        }

        const userStatus = accountProvider.getStatus();
        if (userStatus !== "guest") {
            return this.setState({
                type: "user",
                label: accountProvider.getName()
            });
        }

        return this.setState({
            type: "guest",
            label: ""
        });
    }

    getUserStatus() {
        const userStatus = accountProvider.getStatus();
        if (!validators.isPopulatedString(userStatus)) {
            return "guest";
        }

        return userStatus;
    }

    getUserSubscriptionType() {
        const userSubscriptionType = accountProvider.getSubscriptionType();
        if (!validators.isPopulatedString(userSubscriptionType)) {
            return "";
        }

        return userSubscriptionType;
    }

    render() {
        return (
            <div className="top-menu-wrapper">
                <div className="top-menu">
                    <BackButton/>
                    <TopMenuLabel type={this.state.type} label={this.state.label} isEmpty={this.state.isEmpty}/>
                    <SettingsContainer userStatus={this.getUserStatus()} userSubscriptionType={this.getUserSubscriptionType()}/>
                </div>
            </div>
        );
    }
}

export default TopMenu;