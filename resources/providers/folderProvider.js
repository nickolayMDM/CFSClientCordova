import validators from "../helpers/validators";

const eventName = "refreshCardList";

let _store = null;
let _dispatch = null;
let _eventEmitter = null;
let _validators = null;
let isSwitchingFolder = false;
let currentFolder = {};
let parentFolder = {};

const emitSwitchEvent = (item) => {
    _eventEmitter.emit(eventName, item);
};

let folderProvider = {
    isInitialized: () => {
        return _dispatch !== null && _store !== null && _eventEmitter !== null && _validators !== null;
    },

    isSwitchingFolder: () => {
        return isSwitchingFolder;
    },

    setIsSwitchingFolder: (value) => {
        if (_validators.isBoolean(value)) {
            isSwitchingFolder = value;
        }
    },

    initialize: ({dispatch, store, eventEmitter, validators}) => {
        _dispatch = dispatch;
        _store = store;
        _eventEmitter = eventEmitter;
        _validators = validators;
    },

    switchToRoot: () => {
        if (!folderProvider.isInitialized() || folderProvider.isSwitchingFolder()) {
            return false;
        }

        // currentFolder = {};
        emitSwitchEvent({});
    },

    getCurrent: () => {
        return currentFolder;
    },

    getCurrentId: () => {
        if (typeof currentFolder.ID === "undefined") {
            return null;
        }

        return currentFolder.ID;
    },

    getParent: () => {
        return parentFolder;
    },

    getParentId: () => {
        if (typeof parentFolder.ID === "undefined") {
            return null;
        }

        return parentFolder.ID;
    },

    switchFolder: ({item}) => {
        if (!folderProvider.isInitialized() || folderProvider.isSwitchingFolder()) {
            return false;
        }

        if (typeof item !== "object" || typeof item.ID !== "string") {
            return folderProvider.switchToRoot();
        }

        // currentFolder = item;
        emitSwitchEvent(item);
    },

    setCurrentFolderData: ({item, parent}) => {
        if (!_validators.isObject(item)) {
            item = {};
        }
        currentFolder = item;

        if (!_validators.isObject(parent)) {
            parent = {};
        }
        parentFolder = parent;

        _eventEmitter.emit("currentFolderDataUpdated");
    },

    applyFolderUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default folderProvider;