import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import validators from "../../helpers/validators";
import stringHelpers from "../../helpers/strings";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import Form from "../commons/Form";

const modalName = "renamePost";

class RenamePostModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("renamePost", this.activateRenameModal.bind(this));

        this.state = {
            ID: null
        };

        this.form = {
            name: {
                ref: React.createRef()
            }
        };
    }

    activateRenameModal(post) {
        this.setState({
            ID: post.ID
        });
        this.form.name.ref.current.baseRef.current.setValue(post.name);
        modalProvider.switchToModal({
            name: modalName
        });
        setTimeout(() => {
            this.form.name.ref.current.baseRef.current.inputRef.current.focus();
            this.form.name.ref.current.baseRef.current.inputRef.current.select();
        }, 300);
    }

    isFormValid() {
        for (let key in this.form) {
            if (!this.form.hasOwnProperty(key)) continue;

            if (!this.form[key].ref.current.baseRef.current.validate()) {
                return false;
            }
        }

        return true;
    }

    async handleFormSubmit() {
        await serverRequester.renamePost({
            post: this.state.ID,
            name: this.form.name.ref.current.baseRef.current.state.value,
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
    }

    clearInput() {
        this.form.name.ref.current.baseRef.current.clearInput();
    }

    prepareForm() {
        this.form.name.ref.current.baseRef.current.setValue(stringHelpers.trimSpaces(this.form.name.ref.current.baseRef.current.state.value));
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Rename video", "General")}/>
                <Form preparation={this.prepareForm.bind(this)} validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <TextInput ref={this.form.name.ref}
                                   placeholder={translate("Video name", "General")}
                                   validator={validators.isPopulatedString}
                                   invalid_title={translate("This value can not be empty", "Errors")}/>
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value={translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default RenamePostModal;