import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import folderProvider from "../../providers/folderProvider";
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
import DropdownSelect from "../commons/DropdownSelect";
import flattenTree from "../../modules/flattenTree";

const modalName = "addFolder";

class AddFolderModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("addFolder", this.activateModalByEvent.bind(this));

        this.state = {
            folderTree: {},
            folderID: ""
        };

        this.form = {
            name: {
                ref: React.createRef()
            }
        };
    }

    activateModalByEvent(dataObject) {
        let folderID = folderProvider.getCurrentId();
        if (validators.isNull(folderID)) {
            folderID = "";
        }

        this.clearInput();
        this.setState({
            ...dataObject,
            folderID
        });
        modalProvider.switchToModal({
            name: modalName
        });
    }

    async handleFormSubmit() {
        const requestResult = await serverRequester.postFolder({
            name: this.form.name.ref.current.baseRef.current.state.value,
            parent: this.state.folderID
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
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

    clearInput() {
        this.form.name.ref.current.baseRef.current.clearInput();
    }

    renderFolderTreeOptions() {
        if (!validators.isPopulatedObject(this.state.folderTree)) {
            return "";
        }

        const flattenTreeInstance = new flattenTree.build({
            tree: this.state.folderTree,
            optionOutputValueKey: "ID",
            optionOutputNameKey: "name"
        });

        return flattenTreeInstance.transform();
    }

    handleFolderOptionChange(event) {
        this.setState({
            folderID: event.target.value
        });
    }

    prepareForm() {
        this.form.name.ref.current.baseRef.current.setValue(stringHelpers.trimSpaces(this.form.name.ref.current.baseRef.current.state.value));
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Add new folder", "Actions")}/>
                <Form preparation={this.prepareForm.bind(this)} validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <TextInput className="add-folder-name"
                                   ref={this.form.name.ref}
                                   placeholder={translate("Folder name", "General")}
                                   validator={validators.isPopulatedString}
                                   invalid_title={translate("This value can not be empty", "Errors")}/>
                        <DropdownSelect className="with-indents" onChange={this.handleFolderOptionChange.bind(this)}
                                        value={this.state.folderID}>
                            {this.renderFolderTreeOptions()}
                        </DropdownSelect>
                    </ModalBody>
                    <ModalFooter>
                        <input className="add-folder-submit" type="submit" value={translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default AddFolderModal;