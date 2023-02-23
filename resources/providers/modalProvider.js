const eventName = "switchModal";

let modals = {};
let validators = null;
let _eventEmitter = null;
let currentModal = null;
let currentModalOptions = {};
let isLocked = false;

let unlockTimeout = -1;

const emitSwitchEvent = () => {
    _eventEmitter.emit(eventName, currentModal);
};

/**
 * modal options:
 * backgroundClose - allow background click to close this modal
 */
let modalProvider = {
    isInitialized: () => {
        return Object.keys(modals).length > 0 && _eventEmitter !== null && validators !== null;
    },

    initialize: ({dispatch, eventEmitter, validators}) => {
        modalProvider.defineEventEmitter(eventEmitter);
        modalProvider.defineValidators(validators);
    },

    defineModal: (modalName, options) => {
        if (!validators.isObject(options)) {
            options = {};
        }

        modals[modalName] = options;
    },

    isNotFound: (modalName) => {
        return !Object.keys(modals).includes(modalName);
    },

    defineValidators: (newValidators) => {
        validators = newValidators;
    },

    defineEventEmitter: (eventEmitter) => {
        _eventEmitter = eventEmitter;
    },

    hideModal: () => {
        if (isLocked) {
            return;
        }

        currentModal = null;
        currentModalOptions = {};
        emitSwitchEvent();
    },

    switchToModal: ({name, options = {}} = {}) => {
        if (!modalProvider.isInitialized() || isLocked) {
            return;
        }

        if (typeof name !== "string" || modalProvider.isNotFound(name)) {
            return modalProvider.hideModal();
        }

        currentModal = name;
        if (validators.isObject(options)) {
            currentModalOptions = options;
        }
        emitSwitchEvent();
    },

    lockModal: ({durationMS}) => {
        clearTimeout(unlockTimeout);
        isLocked = true;

        if (validators.isPositiveInteger(durationMS)) {
            unlockTimeout = setTimeout(() => {
                isLocked = false;
            }, durationMS);
        }
    },

    unlockModal: () => {
        clearTimeout(unlockTimeout);
        isLocked = false;
    },

    getCurrentModalName: () => {
        return currentModal;
    },

    getCurrentModalOptions: () => {
        return currentModalOptions;
    },

    getCurrentModalConfig: () => {
        return modals[currentModal];
    },

    applyModalUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default modalProvider;