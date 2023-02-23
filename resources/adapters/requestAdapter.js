import {notify} from "./notificationAdapter";
import validators from "../helpers/validators";
import eventEmitter from "../adapters/eventAdapter";
const axios = require("axios");

const get = async ({url, params = {}, headers = {}, options = {}} = {}) => {
    let response;
    let result = {};

    try {
        response = await axios.get(url, {
            params,
            headers
        });
    } catch (error) {
        response = error.response;

        eventEmitter.emit("d_authorize", error);
        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    result.response = response.data;
    result.status = response.status;

    return result;
};

const post = async ({url, params, headers = {}, options = {}} = {}) => {
    let response;
    let result = {};

    try {
        response = await axios.post(url, params,
        {
            headers: {
                'Content-Type': 'application/JSON',
                ...headers
            }
        });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    result.response = response.data;
    result.status = response.status;

    if (typeof result.response === "string") {
        result.response = JSON.parse(result.response);
    }

    return result;
};

const put = async ({url, params, headers = {}, options = {}} = {}) => {
    let response;
    let result = {};

    try {
        response = await axios.put(url, params,
            {
                headers: {
                    'Content-Type': 'application/JSON',
                    ...headers
                }
            });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    result.response = response.data;
    result.status = response.status;

    if (typeof result.response === "string") {
        result.response = JSON.parse(result.response);
    }

    return result;
};

const del = async ({url, params, headers = {}, options = {}} = {}) => {
    let response;
    let result = {};

    try {
        response = await axios.delete(url, {
            data: params,
            headers: {
                'Content-Type': 'application/JSON',
                ...headers
            }
        });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    result.response = response.data;
    result.status = response.status;

    if (typeof result.response === "string") {
        result.response = JSON.parse(result.response);
    }

    return result;
};

export default { get, post, put, del };

const _displayConnectionError = (error) => {
    if (
        !validators.isPopulatedObject(error.response)
        || !validators.isNumeric(error.response.status)
        || !validators.isPopulatedString(error.response.statusText)
    ) {
        return notify.error("Connection error");
    }

    return notify.error("Connection error: " + error.response.status + " " + error.response.statusText);
};