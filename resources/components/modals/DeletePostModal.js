import React, {Component} from 'react';
import {translate, applyTranslationUpdates} from "../../adapters/translatorAdapter";
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";

const modalName = "deletePost";

class DeletePostModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("deletePost", this.activateDeleteModal.bind(this));

        this.state = {
            ID: null
        };
    }

    activateDeleteModal(postId) {
        this.setState({
            ID: postId
        });
        modalProvider.switchToModal({
            name: modalName
        });
    }

    async handleConfirm() {
        await serverRequester.deletePost({
            post: this.state.ID
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
                <ModalHeader title={translate("Deleting post", "Actions")} />
                <ModalBody>
                    {translate("Delete this video?", "Dialog")}
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

export default DeletePostModal;