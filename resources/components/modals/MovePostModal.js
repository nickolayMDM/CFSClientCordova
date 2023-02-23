import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import flattenTree from "../../modules/flattenTree";
import validators from "../../helpers/validators";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import DropdownSelect from "../commons/DropdownSelect";

const modalName = "movePost";

class MovePostModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("movePost", this.activateRenameModal.bind(this));

        this.state = {
            ID: null,
            folderTree: {},
            folderID: ""
        };
    }

    async activateRenameModal(post) {
        if (!validators.isPopulatedObject(post)) {
            return;
        }

        const simpleFolderTreeResponse = await serverRequester.getSimpleFolderTree();

        const flattenTreeInstance = new flattenTree.build({
            tree: simpleFolderTreeResponse.response,
            optionOutputValueKey: "ID",
            optionOutputNameKey: "name"
        });

        const folderTree = flattenTreeInstance.transform();

        this.setState({
            ID: post.ID,
            folderTree,
            folderID: post.folderID || ""
        });

        modalProvider.switchToModal({
            name: modalName
        });
    }

    handleFolderOptionChange(event) {
        this.setState({
            folderID: event.target.value
        });
    }

    async handleFormSubmit() {
        const requestResult = await serverRequester.movePost({
            post: this.state.ID,
            folder: this.state.folderID
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
    }

    clearInput() {
        this.setState({
            folderTree: {},
            folderID: ""
        });
    }

    renderFolderTreeOptions() {
        if (!validators.isPopulatedArray(this.state.folderTree)) {
            return "";
        }

        return this.state.folderTree;
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Move video", "General")}/>
                <ModalBody>
                    <DropdownSelect className="with-indents" onChange={this.handleFolderOptionChange.bind(this)} value={this.state.folderID}>
                        {this.renderFolderTreeOptions()}
                    </DropdownSelect>
                </ModalBody>
                <ModalFooter>
                    <button onClick={this.handleFormSubmit.bind(this)}>
                        {translate("Move", "Actions")}
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default MovePostModal;