const isNonNegativeInteger = (value) => {
    return (Number.isInteger(value) && value >= 0);
};

const isPositiveInteger = (value) => {
    return (Number.isInteger(value) && value > 0);
};

const isInt = (value) => {
    return Number.isInteger(value);
};

const isTimestamp = (value) => {
    const newTimestamp = new Date(value).getTime();
    return isNumeric(newTimestamp);
};

const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

module.exports = {
    isNonNegativeInteger, isPositiveInteger, isInt, isTimestamp, isNumeric
};