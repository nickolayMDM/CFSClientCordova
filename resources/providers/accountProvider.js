const eventName = "updateAccount";

let _eventEmitter = null;
let _validators = null;
let _translator = null;

let ID = null;
let name = null;
let language = null;
let subscriptionType = null;
let subscriptionEndTimestamp = null;
let status = null;

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let accountProvider = {
    initialize: ({eventEmitter, validators, translator}) => {
        _eventEmitter = eventEmitter;
        _validators = validators;
        _translator = translator;
    },

    isInitialized: () => {
        return _eventEmitter !== null && _validators !== null;
    },

    getID: () => {
        return ID;
    },

    getName: () => {
        return name;
    },

    getLanguage: () => {
        return language;
    },

    getSubscriptionType: () => {
        return subscriptionType;
    },

    getSubscriptionEndTimestamp: () => {
        return subscriptionEndTimestamp;
    },

    getStatus: () => {
        return status;
    },

    getDataObject: () => {
        return {
            ID: accountProvider.getID(),
            name: accountProvider.getName(),
            language: accountProvider.getLanguage(),
            subscriptionType: accountProvider.getSubscriptionType(),
            subscriptionEndTimestamp: accountProvider.getSubscriptionEndTimestamp(),
            status: accountProvider.getStatus()
        };
    },

    clearData: () => {
        ID = null;
        name = null;
        language = null;
        subscriptionType = null;
        subscriptionEndTimestamp = null;
        status = null;

        return accountProvider.getDataObject();
    },

    setFromObject: (object, {clearBefore = false} = {}) => {
        if (!_validators.isPopulatedObject(object)) {
            throw new Error("accountProvider.setFromObject: object parameter must be a non-empty object");
        }
        if (clearBefore) {
            accountProvider.clearData();
        }

        accountProvider.setID(object.ID, {shouldEmitEvent: false});
        accountProvider.setName(object.name, {shouldEmitEvent: false});
        accountProvider.setLanguage(object.language, {shouldEmitEvent: false});
        accountProvider.setSubscriptionType(object.subscriptionType, {shouldEmitEvent: false});
        accountProvider.setSubscriptionEndTimestamp(object.subscriptionEndTimestamp, {shouldEmitEvent: false});
        accountProvider.setStatus(object.status, {shouldEmitEvent: false});

        emitEvent();
    },

    setID: (value, {shouldEmitEvent = true} = {}) => {
        if (_validators.isPopulatedString(value)) {
            ID = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return ID;
    },

    setName: (value, {shouldEmitEvent = true} = {}) => {
        if (_validators.isPopulatedString(value)) {
            name = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return name;
    },

    setLanguage: (value, {shouldEmitEvent = true} = {}) => {
        if (
            _validators.isPopulatedString(value)
            && _validators.isWithin(value, _translator.getAvailableLocales())
        ) {
            language = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return language;
    },

    setSubscriptionType: (value, {shouldEmitEvent = true} = {}) => {
        if (
            _validators.isPopulatedString(value)
        ) {
            subscriptionType = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return subscriptionType;
    },

    setSubscriptionEndTimestamp: (value, {shouldEmitEvent = true} = {}) => {
        if (_validators.isTimestamp(value)) {
            subscriptionEndTimestamp = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return subscriptionEndTimestamp;
    },

    setStatus: (value, {shouldEmitEvent = true} = {}) => {
        if (_validators.isPopulatedString(value)) {
            status = value;
        }

        if (shouldEmitEvent) {
            emitEvent();
        }

        return status;
    },

    applyAccountUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default accountProvider;