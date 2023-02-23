import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import storage from "../../adapters/storageAdapter";
import validators from "../../helpers/validators";
import accountProvider from "../../providers/accountProvider";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import PasswordInput from "../commons/Input/PasswordInput";
import Form from "../commons/Form";
import Button from "../commons/Button";

const modalName = "LogIn";

class LogInModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        this.form = {
            name: {
                ref: React.createRef()
            },
            password: {
                ref: React.createRef()
            }
        };

        eventEmitter.addListener("switchModal", this.clearTheState.bind(this))
    }

    clearTheState() {
        this.setState(this.clearState);
    }

    async handleCancel() {
        modalProvider.hideModal();
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
        let shouldHideModal = true;
        const requestResult = await serverRequester.getUserByPassword({
            name: this.form.name.ref.current.baseRef.current.state.value,
            password: this.form.password.ref.current.baseRef.current.state.value
        });
        if (requestResult.status === 200) {
            accountProvider.setFromObject(requestResult.response, {
                clearBefore: true
            });

            if (typeof requestResult.response.cookie === "string") {
                await storage.set({
                    key: "appUserString",
                    value: requestResult.response.cookie
                });
            }

            eventEmitter.emit("refreshCardList");

            if (typeof requestResult.response.mergingUserID === "string") {
                eventEmitter.emit("startMergingUsers", requestResult.response.mergingUserID);
                shouldHideModal = false;
            }

            if (validators.isFunction(modalProvider.getCurrentModalOptions().callback)) {
                modalProvider.getCurrentModalOptions().callback();
            }
        } else if (requestResult.status === 400) {
            this.form.password.ref.current.baseRef.current.showCustomError(translate("Login or password invalid", "Input.Error"));
            return;
        }

        this.clearInput();

        if (shouldHideModal) {
            modalProvider.hideModal();
        }
    }

    clearInput() {
        this.form.name.ref.current.baseRef.current.clearInput();
        this.form.password.ref.current.baseRef.current.clearInput();
    }

    openRegisterModal() {
        modalProvider.switchToModal({name: "Register"});
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Log in", "General")}/>
                <Form validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody className="form">
                        <TextInput ref={this.form.name.ref}
                                   placeholder={translate("Login", "General")}
                                   validator={validators.isPopulatedString}
                                   invalid_title={translate("This value can not be empty", "Errors")}/>
                        <PasswordInput ref={this.form.password.ref}
                                       placeholder={translate("Password", "General")}
                                       validator={validators.isPopulatedString}
                                       invalid_title={translate("This value can not be empty", "Errors")}/>
                        <p className="form-margin">
                            {translate("Don't have an account?", "Dialog")} <Button className="button-link"
                                                                                    onClick={this.openRegisterModal.bind(this)}>{translate("Register Now!", "Dialog")}</Button>
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="button-muted" onClick={this.handleCancel.bind(this)}>
                            {translate("Cancel", "Actions")}
                        </Button>
                        <input type="submit" value={translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default LogInModal;