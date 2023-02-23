import validators from "../../helpers/validators";
import moveFolderBuffer from "./moveFolderBuffer";

const TYPE_EMPTY = "empty";

let _eventEmitter = null;
let currentData = {
    type: TYPE_EMPTY
};
let pasteFunc = null;

const emitEvent = () => {
    _eventEmitter.emit("pasteToCurrentFolder");
};

let bufferProvider = {
    initialize: ({eventEmitter}) => {
        _eventEmitter = eventEmitter;
    },

    moveFolder: ({data}) => {
        currentData = moveFolderBuffer.setCurrentData({data});
        pasteFunc = moveFolderBuffer.paste;
    },
    movePost: ({data}) => {
        currentData = {
            type: TYPE_MOVE_POST,
            data
        };
    },
};

export default bufferProvider;