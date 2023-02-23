let _eventEmitter, _serverRequester, _debugAdapter, _validators;
let allowedHosts = [];
let subscriptions = [];

const initialize = async ({hosts, eventEmitter, validators, serverRequester, debugAdapter}) => {
    if (!validators.isPopulatedArray(hosts)) {
        throw new Error("linkingProvider can not be initialized with an empty hosts parameter");
    }

    _eventEmitter = eventEmitter;
    _serverRequester = serverRequester;
    _debugAdapter = debugAdapter;
    _validators = validators;
    allowedHosts = hosts;

    if (!validators.isObject(window.plugins) || !validators.isObject(window.plugins.intent)) {
        _debugAdapter.log("intent plugin not installed");
        return;
    }

    window.plugins.intent.getCordovaIntent(processIntent);
    window.plugins.intent.setNewIntentHandler(processIntent);
};

const subscribe = (func) => {
    if (typeof func !== "function") {
        throw new Error("linking subscription requires a function");
    }

    subscriptions.push(func);
};

const processUrl = async ({url, isSilent = false} = {}) => {
    if (!isUrlValid({url})) {
        if (isSilent) {
            return;
        }
        throw new Error("invalid url passed to the linkingAdapter");
    }

    const requestResult = await _serverRequester.getInputDetails({
        input: url
    });

    if (subscriptions.length > 0) {
        for (let key in subscriptions) {
            if (!subscriptions.hasOwnProperty(key)) continue;

            subscriptions[key](url);
        }
    }

    _eventEmitter.emit("addPost", {
        url,
        name: requestResult.response.post.name,
        imagePath: requestResult.response.post.imageUrl,
        author: requestResult.response.post.author,
        data: requestResult.response.post.originalData,
        folderTree: requestResult.response.folderTree,
        provider: requestResult.response.post.provider
    });
};

export default {initialize, processUrl, subscribe};

const processIntent = async (intent) => {
    if (!_validators.isObject(intent) || !_validators.isArray(intent.clipItems)) {
        return;
    }

    for (let key in intent.clipItems) {
        await processUrl({
            url: intent.clipItems[key].text,
            isSilent: true
        });
    }
};

const isUrlValid = ({url}) => {
    const urlData = new URL(url);

    return allowedHosts.indexOf(urlData.hostname) > -1;
};