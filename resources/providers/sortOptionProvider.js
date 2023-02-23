const eventName = "updateSortOption";
const storageKey = "sortOption";

let _eventEmitter = null;
let _validators = null;
let _storage = null;
let sortOptions = {};
let currentSortOption = "";
let defaultSortOption = "";
let firstOptionSet = false;

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

/**
 * scene options:
 * activate: boolean - display this scene right after defining it
 */
let sortOptionProvider = {
    initialize: ({eventEmitter, validators, storage, initialSortOptions = {}, defaultOption} = {}) => {
        _eventEmitter = eventEmitter;
        _validators = validators;
        _storage = storage;
        defaultSortOption = defaultOption;

        for (let key in initialSortOptions) {
            if (!initialSortOptions.hasOwnProperty(key)) continue;

            sortOptionProvider.defineSortOption(key, initialSortOptions[key]);
        }

        if (!firstOptionSet) {
            sortOptionProvider.switchTo({
                name: defaultSortOption
            })
        }
    },

    isInitialized: () => {
        return Object.keys(sortOptions).length > 0 && _eventEmitter !== null && _validators !== null;
    },

    defineSortOption: (name, options) => {
        if (!_validators.isObject(options)) {
            options = {};
        }

        sortOptions[name] = options;

        if (options.activate === true) {
            const isSwitched = sortOptionProvider.switchTo({
                name
            });
            if (isSwitched) {
                firstOptionSet = true;
            }
        }
    },

    isNotFound: (name) => {
        return !Object.keys(sortOptions).includes(name);
    },

    switchTo: ({name, shouldEmitEvent = true} = {}) => {
        if (
            currentSortOption === name
            || !sortOptionProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || sortOptionProvider.isNotFound(name)
        ) {
            return false;
        }

        currentSortOption = name;
        _storage.set({
            key: storageKey,
            value: name
        });

        if (shouldEmitEvent) {
            emitEvent();
        }

        return true;
    },

    getSortOptions: () => {
        return sortOptions;
    },

    getCurrentSortOption: () => {
        return currentSortOption;
    },

    getCurrentSortOptionData: () => {
        return sortOptions[currentSortOption];
    },

    getEventName: () => {
        return eventName;
    },

    getStorageKey: () => {
        return storageKey;
    },

    applySortOptionUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default sortOptionProvider;