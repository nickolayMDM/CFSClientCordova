import React, {Component} from 'react';
import modalProvider from "../../../providers/modalProvider";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'

/**
 props:
 title - string,
 onClose - function that is triggered on close button click
 */
class ModalHeader extends Component {
    handleClose() {
        modalProvider.hideModal();
    }

    render() {
        return (
            <div className="modal-header">
                <h2 className="modal-title">{this.props.title}</h2>
                <FontAwesomeIcon className="modal-header-close" onClick={this.handleClose} icon={faTimesCircle} size="2x"/>
            </div>
        );
    }
}

export default ModalHeader;