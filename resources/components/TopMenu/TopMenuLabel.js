import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import modalProvider from "../../providers/modalProvider";
import accountProvider from "../../providers/accountProvider";

import Svg from "../commons/Svg";

import folderImage from "../../images/CardList/FolderCard/folder.svg";
import emptyFolderImage from "../../images/CardList/FolderCard/folderEmpty.svg";
import searchImage from "../../images/TopMenu/search.svg";
import basicUserImage from "../../images/TopMenu/user_basic.svg";
import premiumUserImage from "../../images/TopMenu/user_premium.svg";

class TopMenuLabel extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    displayContent() {
        if (this.props.type === "folder") {
            return this._displayFolderContent();
        }

        if (this.props.type === "user") {
            return this._displayUserContent();
        }

        if (this.props.type === "search") {
            return this._displaySearchContent();
        }

        return this._displayGuestContent();
    }

    openLoginModal() {
        modalProvider.switchToModal({name: "LogIn"});
    }

    _displayFolderContent() {
        return (
            <div className="top-menu-label-inline top-menu-label-folder">
                <Svg src={(this.props.isEmpty) ? emptyFolderImage : folderImage} width="42" height="34"/>
                <p>{this.props.label}</p>
            </div>
        );
    }

    _displayGuestContent() {
        return (
            <div onClick={this.openLoginModal.bind(this)}>
                <p>{translate("Guest", "General")}</p>
                <p className="small-text">{translate("Log in", "Actions")}</p>
            </div>
        );
    }

    __getUserSvgPath() {
        const subscriptionType = accountProvider.getSubscriptionType();

        switch (subscriptionType) {
            case "premium":
                return premiumUserImage;
            default:
                return basicUserImage;
        }
    }

    _displayUserContent() {
        return (
            <div className="top-menu-label-inline">
                <Svg src={this.__getUserSvgPath()} width="34" height="34"/>
                <p>{this.props.label}</p>
            </div>

        );
    }

    _displaySearchContent() {
        return (
            <div className="top-menu-label-folder">
                <Svg src={searchImage} width="17" height="17"/>
                <p>{translate("Search", "General")}</p>
            </div>
        );
    }

    render() {
        return (
            <div className="top-menu-label">
                {this.displayContent()}
            </div>
        );
    }
}

export default TopMenuLabel;