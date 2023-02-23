import validators from "../helpers/validators";

let loadedScripts = [];

const isScriptLoaded = (path) => {
    return loadedScripts.includes(path);
};

const appendScriptIntoLoadedList = (path) => {
    loadedScripts.push(path);
};

const loadScript = ({path, callback, async = false, force = false} = {}) => {
    if (isScriptLoaded(path) && !force) {
        return false;
    }

    const script = document.createElement("script");
    script.src = path;
    script.async = async;
    script.onload = function () {
        appendScriptIntoLoadedList(path);
        if (validators.isFunction(callback)) {
            callback(script);
        }
    };

    document.body.appendChild(script);
    return true;
};

export default {loadScript};