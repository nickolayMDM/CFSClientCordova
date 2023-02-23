import React, {Component} from 'react';

import Modal from "../commons/Modal";
import ModalBody from "../commons/Modal/ModalBody";

const modalName = "createdBy";

class CreatedByModal extends Component {
    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalBody>
                    <p className="font-magnificent">Created by Mykola Mykhaliuk</p>
                </ModalBody>
            </Modal>
        );
    }
}

export default CreatedByModal;