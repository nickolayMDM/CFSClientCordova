import React, {Component} from 'react';
import linkingAdapter from "../../adapters/linkingAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import modalProvider from "../../providers/modalProvider";
import stringHelpers from "../../helpers/strings";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import validators from "../../helpers/validators";
import Form from "../commons/Form";

const modalName = "findPost";

class AddFolderModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("switchModal", (name) => {
            if (name === modalName) {
                this.clearInput();
            }
        });

        this.form = {
            link: {
                ref: React.createRef()
            }
        };
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
        if (this.form.link.ref.current.baseRef.current.state.value === "Mykola Mykhaliuk MDM") {
            return modalProvider.switchToModal({
                name: "createdBy"
            });
        }

        await linkingAdapter.processUrl({
            url: this.form.link.ref.current.baseRef.current.state.value
        });
        this.clearInput();
    }

    clearInput() {
        this.form.link.ref.current.baseRef.current.clearInput();
    }

    prepareForm() {
        this.form.link.ref.current.baseRef.current.setValue(stringHelpers.trimSpaces(this.form.link.ref.current.baseRef.current.state.value));
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Enter the Video Link", "Dialog")}/>
                <Form preparation={this.prepareForm.bind(this)} validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <TextInput ref={this.form.link.ref}
                                   placeholder={translate("Video link", "General")}
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

export default AddFolderModal;