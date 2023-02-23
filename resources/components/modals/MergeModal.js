import React, {Component} from 'react';
import modalProvider from "../../providers/modalProvider";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import serverRequester from "../../adapters/serverRequesterAdapter";
import eventEmitter from "../../adapters/eventAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";

const modalName = "MergeUsers";

class MergeModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("startMergingUsers", this.activateModal.bind(this));

        this.state = {
            userID: ""
        };
    }

    activateModal(userID) {
        this.setState({
            userID
        });
        modalProvider.switchToModal({
            name: modalName
        });
    }

    async handleCancel() {
        modalProvider.hideModal();
    }

    async handleConfirm() {
        await serverRequester.mergeUserWithCurrent({
            userID: this.state.userID
        });
        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Merge", "General")}/>
                <ModalBody className="form">
                    <p className="modal-main-text">{translate("What should we do with the temporary data?", "Dialog")}</p>
                    <div className="modal-button-choice">
                        <button className="button-fat" onClick={this.handleConfirm.bind(this)}>
                            {translate("Save", "Actions")}
                        </button>
                        <p className="modal-choice-division">{translate("or", "General")}</p>
                        <button className="button-fat button-grey" onClick={this.handleCancel.bind(this)}>
                            {translate("Ignore", "Actions")}
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default MergeModal;