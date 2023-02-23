const eventName = "updateColorMode";

let colorModes = {};
let defaultColorModeName = "";
let currentColorMode = "";
let _dispatch = null;
let _storage = null;
let _validators = null;
let _eventEmitter = null;
let firstModeSet = false;

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let colorModeProvider = {
    initialize: ({dispatch, storage, initialModes = {}, defaultMode, userSubscriptionType, validators, eventEmitter}) => {
        _dispatch = dispatch;
        _storage = storage;
        _validators = validators;
        _eventEmitter = eventEmitter;
        defaultColorModeName = defaultMode;

        for (let key in initialModes) {
            if (!initialModes.hasOwnProperty(key)) continue;

            colorModeProvider.defineColorMode(key, initialModes[key], userSubscriptionType)
        }

        if (!firstModeSet) {
            colorModeProvider.switchTo({
                name: defaultColorModeName,
                userSubscriptionType
            })
        }
    },

    isInitialized: () => {
        return _dispatch !== null && _eventEmitter !== null && _validators !== null && _storage !== null && Object.keys(colorModes).length > 0;
    },

    defineColorMode: (name, options, userSubscriptionType) => {
        if (!_validators.isObject(options)) {
            options = {};
        }

        colorModes[name] = options;

        if (options.activate === true) {
            const isSwitched = colorModeProvider.switchTo({
                name,
                userSubscriptionType
            });
            if (isSwitched) {
                firstModeSet = true;
            }
        }
    },

    isNotFound: (name) => {
        return !Object.keys(colorModes).includes(name);
    },

    isModeValid: (name) => {
        return _validators.isDefined(colorModes[name]);
    },

    isColorModeAllowedForUser: ({userSubscriptionType, name}) => {
        return (
            !_validators.isPopulatedArray(colorModes[name].subscriptionTypes)
            || _validators.isWithin(userSubscriptionType, colorModes[name].subscriptionTypes)
        );
    },

    validateCurrentColorMode: ({userSubscriptionType}) => {
        const isColorModeAllowedForUser = colorModeProvider.isColorModeAllowedForUser({
            name: currentColorMode,
            userSubscriptionType
        });

        if (!isColorModeAllowedForUser) {
            colorModeProvider.switchTo({
                name: defaultColorModeName,
                userSubscriptionType
            });
        }
    },

    switchTo: ({name, userSubscriptionType, shouldEmitEvent = true} = {}) => {
        if (
            currentColorMode === name
            || !colorModeProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || colorModeProvider.isNotFound(name)
            || !colorModeProvider.isColorModeAllowedForUser({userSubscriptionType, name})
        ) {
            return false;
        }

        currentColorMode = name;
        _storage.set({
            key: "colorMode",
            value: name
        });

        if (shouldEmitEvent) {
            emitEvent();
        }

        return true;
    },

    getCurrentColorMode: () => {
        return currentColorMode;
    },

    getModeOptions: (name) => {
        return colorModes[name];
    },

    applyColorModeUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default colorModeProvider;