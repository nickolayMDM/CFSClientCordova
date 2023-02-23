import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import stringHelpers from "../../helpers/strings";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import validators from "../../helpers/validators";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextArea from "../commons/TextArea";
import Form from "../commons/Form";

const modalName = "setPostModal";

class SetPostNoteModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("openSetNoteModal", this.activateModal.bind(this));

        this.state = {
            ID: null
        };

        this.form = {
            note: {
                ref: React.createRef()
            }
        };
    }

    activateModal(post) {
        this.setState({
            ID: post.ID
        });
        this.form.note.ref.current.setValue(post.note);
        modalProvider.switchToModal({
            name: modalName
        });
        setTimeout(() => {
            this.form.note.ref.current.inputRef.current.focus();
            this.form.note.ref.current.inputRef.current.select();
        }, 300);
    }

    isFormValid() {
        for (let key in this.form) {
            if (!this.form.hasOwnProperty(key)) continue;

            if (!this.form[key].ref.current.validate()) {
                return false;
            }
        }

        return true;
    }

    async handleFormSubmit() {
        await serverRequester.setPostNote({
            note: this.form.note.ref.current.state.value,
            post: this.state.ID
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
    }

    clearInput() {
        this.form.note.ref.current.clearInput();
    }

    beforeNoteValueSet(value) {
        if (value.length > 80) {
            value = value.substr(0, 80);
        }

        return value;
    }

    prepareForm() {
        this.form.note.ref.current.setValue(stringHelpers.trimSpaces(this.form.note.ref.current.state.value));
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Change video note", "General")}/>
                <Form preparation={this.prepareForm.bind(this)} validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <TextArea rows="7"
                                  ref={this.form.note.ref}
                                  placeholder={translate("Video note", "General")}
                                  validator={validators.isString}
                                  before_set={this.beforeNoteValueSet}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value={translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default SetPostNoteModal;