const isWithin = (needle, haystack) => {
    if (isArray(haystack)) {
        return (haystack.indexOf(needle) > -1);
    }

    if (isObject(haystack)) {
        return (haystack[needle] !== undefined);
    }

    return false;
};

const isArray = (value) => {
    return (Array.isArray(value));
};

const isEmptyArray = (value) => {
    return (isArray(value) && value.length <= 0);
};

const isObject = (value) => {
    return (isObjectType(value) && !isArray(value));
};

const isPopulatedObject = (value) => {
    return (isObjectType(value) && !isArray(value) && Object.keys(value).length > 0);
};

const isPopulatedArray = (value) => {
    return (isArray(value) && value.length > 0);
};

const isEmptyObject = (value) => {
    return (isObjectType(value) && !isArray(value) && Object.keys(value).length === 0);
};

const isObjectType = (value) => {
    return (typeof value === "object");
};

const isRegExp = (value) => {
    return value instanceof RegExp;
};

module.exports = {
    isArray, isEmptyArray, isObject, isPopulatedObject, isPopulatedArray, isEmptyObject, isObjectType, isWithin, isRegExp
};