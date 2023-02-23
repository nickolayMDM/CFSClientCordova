import React, {Component} from 'react';
import eventEmitter from "../../adapters/eventAdapter";
import validators from "../../helpers/validators";
import folderProvider from "../../providers/folderProvider";

import Svg from "../commons/Svg";

import backImage from "../../images/TopMenu/back.svg";

class BackButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplayed: false
        };

        eventEmitter.addListener("currentFolderDataUpdated", async () => {
            await this.updateDisplay();
        });
    }

    updateDisplay() {
        const folderId = folderProvider.getCurrentId();
        if (
            validators.isNull(folderId)
            || !validators.isDefined(folderId)
        ) {
            this.setState({
                isDisplayed: false
            });
            return;
        }
        this.setState({
            isDisplayed: true
        });
    }

    goUpAFolder() {
        folderProvider.switchFolder({
            item: folderProvider.getParent()
        });
        eventEmitter.emit("moveFolder");
    }

    renderBackButton() {
        if (this.state.isDisplayed) {
            return (
                <Svg src={backImage} width="30" height="30" onClick={this.goUpAFolder.bind(this)}/>
            );
        }

        return "";
    }

    render() {
        return (
            <div className="back-button">
                {this.renderBackButton()}
            </div>
        );
    }
}

export default BackButton;