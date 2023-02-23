import React, {Component} from 'react';
import eventEmitter from '../../adapters/eventAdapter';
import serverRequester from "../../adapters/serverRequesterAdapter";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import Svg from "../commons/Svg";

import addFolderImage from "../../images/ControlMenu/addFolder.svg";

import "../../styles/ControlMenu/AddFolderButton.scss";

class AddFolderButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    async openAddFolderModal() {
        const requestResult = await serverRequester.getSimpleFolderTree();

        eventEmitter.emit("addFolder", {
            folderTree: requestResult.response
        });
    }

    render() {
        return (
            <div className="add-folder-button" onClick={this.openAddFolderModal.bind(this)}>
                <Svg src={addFolderImage} width="50" height="48" />
                <p className="description-text">{translate("Add Folder", "Actions")}</p>
            </div>
        );
    }
}

export default AddFolderButton;