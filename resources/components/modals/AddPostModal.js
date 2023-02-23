import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import modalProvider from "../../providers/modalProvider";
import folderProvider from "../../providers/folderProvider";
import eventEmitter from "../../adapters/eventAdapter";
import validators from "../../helpers/validators";
import flattenTree from "../../modules/flattenTree";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import DropdownSelect from "../commons/DropdownSelect";
import PostCard from "../CardList/PostCard";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import Form from "../commons/Form";
import TextArea from "../commons/TextArea";
import stringHelpers from "../../helpers/strings";

const modalName = "addPost";

class AddPostModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        eventEmitter.addListener("addPost", this.activateModalByEvent.bind(this));

        this.state = {
            url: "",
            imagePath: "",
            author: "",
            data: {},
            folderTree: {},
            folderID: "",
            provider: "",
            isSwitchedToNote: false
        };

        this.form = {
            name: {
                ref: React.createRef()
            },
            note: {
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
        this.form.name.ref.current.baseRef.current.setValue(dataObject.name);
        modalProvider.switchToModal({
            name: modalName
        });
    }

    isFormValid() {
        if (!this.form.name.ref.current.baseRef.current.validate()) {
            return false;
        }
        if (!this.form.note.ref.current.validate()) {
            return false;
        }

        return true;
    }

    async handleFormSubmit() {
        if (this.state.isSwitchedToNote) {
            return this.setState({
                isSwitchedToNote: false
            });
        }

        const requestResult = await serverRequester.addPost({
            url: this.state.url,
            data: this.state.data,
            name: this.form.name.ref.current.baseRef.current.state.value,
            note: this.form.note.ref.current.state.value,
            folder: this.state.folderID,
            provider: this.state.provider
        });

        eventEmitter.emit("refreshCardList");
        modalProvider.hideModal();
        this.clearInput();
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

    handlePostCardAddNote() {
        this.setState({
            isSwitchedToNote: true
        });
    }

    getDefaultFormClassName() {
        if (this.state.isSwitchedToNote) {
            return "hidden";
        }

        return "";
    }

    getNoteFormClassName() {
        if (!this.state.isSwitchedToNote) {
            return "hidden";
        }

        return "";
    }

    beforeNoteValueSet(value) {
        if (value.length > 80) {
            value = value.substr(0, 80);
        }

        return value;
    }

    prepareForm() {
        this.form.name.ref.current.baseRef.current.setValue(stringHelpers.trimSpaces(this.form.name.ref.current.baseRef.current.state.value));
        this.form.note.ref.current.setValue(stringHelpers.trimSpaces(this.form.note.ref.current.state.value));
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Add Video", "Actions")}/>
                <Form preparation={this.prepareForm.bind(this)} validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <PostCard editable={false} item={this.state} imageUrl={this.state.imagePath}
                                  customNoteAction={this.handlePostCardAddNote.bind(this)}/>
                        <div className="form" className={this.getDefaultFormClassName()}>
                            <TextInput ref={this.form.name.ref}
                                       placeholder={translate("Video name", "General")}
                                       validator={validators.isPopulatedString}
                                       invalid_title={translate("This value can not be empty", "Errors")}/>
                            <DropdownSelect className="with-indents" onChange={this.handleFolderOptionChange.bind(this)}
                                            value={this.state.folderID}>
                                {this.renderFolderTreeOptions()}
                            </DropdownSelect>
                        </div>

                        <div className="form" className={this.getNoteFormClassName()}>
                            <TextArea rows="5"
                                      ref={this.form.note.ref}
                                      placeholder={translate("Video note", "General")}
                                      validator={validators.isString}
                                      before_set={this.beforeNoteValueSet}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit"
                               value={(this.state.isSwitchedToNote) ? translate("Save note", "Actions") : translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default AddPostModal;