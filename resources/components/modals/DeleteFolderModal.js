import React, {Component} from 'react';
import {translate, applyTranslationUpdates} from "../../adapters/translatorAdapter";
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";

const modalName = "deleteFolder";

class DeleteFolderModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("deleteFolder", this.activateDeleteModal.bind(this));

        this.state = {
            ID: null
        };
    }

    activateDeleteModal(folderId) {
        this.setState({
            ID: folderId
        });
        modalProvider.switchToModal({
            name: modalName
        });
    }

    async handleConfirm() {
        const requestResult = await serverRequester.deleteFolder({
            folder: this.state.ID
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
    }

    async handleCancel() {
        modalProvider.hideModal();
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Deleting folder", "Actions")} />
                <ModalBody>
                    {translate("Delete this folder?", "Dialog")}
                </ModalBody>
                <ModalFooter>
                    <button className="button-muted" onClick={this.handleCancel.bind(this)}>
                        {translate("Cancel", "Actions")}
                    </button>
                    <button onClick={this.handleConfirm.bind(this)}>
                        {translate("Confirm", "Actions")}
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default DeleteFolderModal;