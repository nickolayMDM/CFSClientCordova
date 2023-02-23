import validators from "../helpers/validators";

const eventName = "switchScene";

/**
 * scene options:
 * activate: boolean - display this scene right after defining it
 */
let scenes = {};
let _eventEmitter = null;
let currentScene = "";

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let sceneProvider = {
    initialize: ({eventEmitter}) => {
        _eventEmitter = eventEmitter;
    },

    isInitialized: () => {
        return Object.keys(scenes).length > 0 && _eventEmitter !== null;
    },

    defineScene: (sceneName, options) => {
        if (!validators.isObject(options)) {
            options = {};
        }

        scenes[sceneName] = options;

        if (options.activate === true) {
            sceneProvider.switchToScene({
                name: sceneName
            });
        }
    },

    isNotFound: (sceneName) => {
        return !Object.keys(scenes).includes(sceneName);
    },

    switchToScene: ({name}) => {
        if (!sceneProvider.isInitialized() || typeof name !== "string" || sceneProvider.isNotFound(name)) {
            return false;
        }

        currentScene = name;
        emitEvent();
    },

    getCurrentSceneName: () => {
        return currentScene;
    },

    getCurrentSceneOptions: () => {
        return scenes[currentScene];
    },

    getEventName: () => {
        return eventName;
    }
};

export default sceneProvider;