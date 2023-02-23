import React, {Component} from 'react';
import {setLocale, translate, getAvailableLocales, getCurrentLocale, applyTranslationUpdates} from "../../adapters/translatorAdapter";
import sortOptionProvider from "../../providers/sortOptionProvider";
import modalProvider from "../../providers/modalProvider";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";

import Button from "../commons/Button";

const modalName = "ChooseSortOption";

class ChooseLanguageModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        sortOptionProvider.applySortOptionUpdates(this);
    }

    async switchSortOption(name) {
        await sortOptionProvider.switchTo({
            name
        });
    }

    _renderLanguageButtons() {
        const options = sortOptionProvider.getSortOptions();
        const currentOption = sortOptionProvider.getCurrentSortOption();
        let buttons = [];
        let iteration = 0;

        for (let key in options) {
            if (!options.hasOwnProperty(key)) continue;

            let className = "button-contained button-fat";
            if (iteration > 0) {
                className += " form-margin";
            }
            if (key === currentOption) {
                className += " button-grey";
            }

            let onClick;
            if (key !== currentOption) {
                onClick = this.switchSortOption.bind(this, key);
            }

            buttons.push(<Button key={iteration} className={className}
                                 onClick={onClick}>{translate(options[key].title, "General")}</Button>);
            iteration++;
        }

        return buttons;
    }

    closeModal() {
        modalProvider.hideModal();
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Choose sorting", "Actions")}/>
                <ModalBody>
                    {this._renderLanguageButtons()}
                </ModalBody>
                <ModalFooter>
                    <Button className="add-folder-submit" onClick={this.closeModal.bind(this)}>{translate("Close", "General")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ChooseLanguageModal;