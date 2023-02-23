import React, {Component} from 'react';
import modalProvider from "../../providers/modalProvider";
import eventEmitter from "../../adapters/eventAdapter";
import storageAdapter from "../../adapters/storageAdapter";
import accountProvider from "../../providers/accountProvider";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Modal from "../commons/Modal";
import ModalBody from "../commons/Modal/ModalBody";
import AdvertPlaceholder from "../_dev/AdvertPlaceholder";

import "../../styles/modals/AdvertModal.scss";

const modalName = "advert";
const displayModalEventName = "showAdvert";
const storageLastAdvertTimestampKey = "last_advert_timestamp";
const advertCooldownMS = 300000; //1000 * 60 * 5
const modalLock = 3000;

let lockTimeout = -1;

class AdvertModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locked: true
        };

        this.advertItemRef = React.createRef();

        eventEmitter.addListener(displayModalEventName, this.displayAdvert.bind(this));
        document.addEventListener("resume", async () => {
            const shouldDisplayAdvert = await this.shouldDisplayAdvert();
            if (shouldDisplayAdvert) {
                this.displayAdvert();
            }
        }, false);
    }

    async componentDidMount() {
        const shouldDisplayAdvert = await this.shouldDisplayAdvert();
        if (shouldDisplayAdvert) {
            this.displayAdvert();
        }
    }

    async shouldDisplayAdvert() {
        if (accountProvider.getSubscriptionType() !== "free") {
            return false;
        }

        const lastAdvertTimestamp = await storageAdapter.get({key: storageLastAdvertTimestampKey});
        const nextAdvertTimestamp = (lastAdvertTimestamp || 0) + advertCooldownMS;
        const currentTimestamp = Date.now();

        return currentTimestamp > nextAdvertTimestamp;
    }

    displayAdvert() {
        clearTimeout(lockTimeout);
        this.setState({
            locked: true
        });

        modalProvider.switchToModal({name: modalName});
        modalProvider.lockModal({
            durationMS: modalLock
        });
        lockTimeout = setTimeout(() => {
            this.setState({
                locked: false
            });
        }, modalLock);

        this.advertItemRef.current.pickAnAdvert();

        storageAdapter.set({
            key: storageLastAdvertTimestampKey,
            value: Date.now()
        });
    }

    handleClose() {
        modalProvider.hideModal();
    }

    getClassName() {
        let classNameArray = [
            "elevation-vh-15"
        ];
        if (this.state.locked) {
            classNameArray.push("modal-locked");
        }

        return classNameArray.join(" ");
    }

    render() {
        return (
            <Modal name={modalName} className={this.getClassName()}>
                <FontAwesomeIcon className="modal-header-close" onClick={this.handleClose} icon={faTimesCircle} size="2x"/>
                <ModalBody>
                    <AdvertPlaceholder ref={this.advertItemRef}/>
                </ModalBody>
            </Modal>
        );
    }
}

export default AdvertModal;