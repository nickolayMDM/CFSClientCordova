const maxLogsCount = 10;
const logContainer = [];
let eventEmitter;

const initialize = (newEventEmitter) => {
    eventEmitter = newEventEmitter;
};

const log = (text) => {
    logContainer.push(text);
    console.log(text);

    eventEmitter.emit("debug_newLog", text);
    clearOldLogsRecursive();
};

const getLogData = () => {
    return logContainer;
};

const getLastLogEntry = () => {
    if (logContainer.length <= 0) {
        return "";
    }

    return logContainer[logContainer.length - 1];
};

export default {initialize, log, getLogData, getLastLogEntry};

const clearOldLogsRecursive = () => {
    if (logContainer.length > maxLogsCount) {
        logContainer.shift();
        clearOldLogsRecursive();
    }
};
