import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import {translate, applyTranslationUpdates} from "../../adapters/translatorAdapter";
import validators from "../../helpers/validators";
import accountProvider from "../../providers/accountProvider";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import PasswordInput from "../commons/Input/PasswordInput";
import EmailInput from "../commons/Input/EmailInput";
import Form from "../commons/Form";
import Button from "../commons/Button";

const modalName = "Register";

class RegisterModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        this.form = {
            name: {
                ref: React.createRef()
            },
            email: {
                ref: React.createRef()
            },
            password: {
                ref: React.createRef()
            },
            passwordConfirm: {
                ref: React.createRef()
            },
        };
    }

    clearInput() {
        this.form.name.ref.current.baseRef.current.clearInput();
        this.form.email.ref.current.baseRef.current.clearInput();
        this.form.password.ref.current.baseRef.current.clearInput();
        this.form.passwordConfirm.ref.current.baseRef.current.clearInput();
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
        const requestResult = await serverRequester.addPasswordAuthorizationToUser({
            name: this.form.name.ref.current.baseRef.current.state.value,
            email: this.form.email.ref.current.baseRef.current.state.value,
            password: this.form.password.ref.current.baseRef.current.state.value
        });

        if (validators.isOkStatus(requestResult.status)) {
            accountProvider.setFromObject(requestResult.response);
        } else if (validators.isDefined(requestResult.response.error) && requestResult.response.name === "tokenExists") {
            this.form.name.ref.current.baseRef.current.showCustomError(translate("Login is taken", "Errors"));
            return;
        }

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
    }

    openLogInModal() {
        modalProvider.switchToModal({name: "LogIn"});
    }

    isPasswordConfirmed() {
        return (this.form.password.ref.current.baseRef.current.state.value === this.form.passwordConfirm.ref.current.baseRef.current.state.value);
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Register", "General")}/>
                <Form validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody className="form">
                        <TextInput ref={this.form.name.ref}
                                   placeholder={translate("Login", "General")}
                                   validator={validators.isPopulatedString}
                                   invalid_title={translate("This value can not be empty", "Errors")}/>
                        <EmailInput ref={this.form.email.ref}
                                    placeholder={translate("Email", "General")}
                                    validator={validators.isEmail}
                                    invalid_title={translate("Invalid email format", "Errors")}/>
                        <PasswordInput ref={this.form.password.ref}
                                       placeholder={translate("Password", "General")}
                                       validator={validators.isPopulatedString}
                                       invalid_title={translate("This value can not be empty", "Errors")}/>
                        <PasswordInput ref={this.form.passwordConfirm.ref}
                                       placeholder={translate("Confirm password", "Dialog")}
                                       validator={this.isPasswordConfirmed.bind(this)}
                                       invalid_title={translate("This value has to be the same as the password value", "Errors")}/>
                        <p>
                            {translate("Already have an account?", "Dialog")} <Button className="button-link"
                                                                                     onClick={this.openLogInModal.bind(this)}>{translate("Log In Here!", "Dialog")}</Button>
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

export default RegisterModal;