import React, {Component} from 'react';
import {setLocale, translate, getAvailableLocales, getCurrentLocale, applyTranslationUpdates} from "../../adapters/translatorAdapter";
import modalProvider from "../../providers/modalProvider";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";

import Button from "../commons/Button";

const modalName = "ChooseLanguage";

class ChooseLanguageModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    async switchLanguage(locale) {
        await setLocale({
            localeCode: locale,
            updateServer: false
        });
    }

    _renderLanguageButtons() {
        const locales = getAvailableLocales();
        const currentLocale = getCurrentLocale();
        let buttons = [];
        let iteration = 0;

        for (let key in locales) {
            if (!locales.hasOwnProperty(key)) continue;

            let className = "button-contained button-fat";
            if (iteration > 0) {
                className += " form-margin";
            }
            if (key === currentLocale) {
                className += " button-grey";
            }

            let onClick;
            if (key !== currentLocale) {
                onClick = this.switchLanguage.bind(this, key);
            }

            buttons.push(<Button key={iteration} className={className}
                                 onClick={onClick}>{locales[key].name}</Button>);
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
                <ModalHeader title={translate("Choose your language", "Actions")}/>
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