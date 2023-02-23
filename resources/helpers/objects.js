const validators = require("./validators");

let objectHelpers = {
    transformStringWithDelimitersToArray: (delimiter, string) => {
        if (!string.includes(delimiter)) return [string];
        let stringArray = string.split(delimiter);

        return stringArray;
    },
    findNestedPropertyInObject: (object, keys) => {
        if (typeof keys === "string") {
            keys = objectHelpers.transformStringWithDelimitersToArray(".", keys);
        }
        if (!validators.isPopulatedArray(keys)) {
            return false;
        }

        let iterate = function (object, keys) {
            if (
                (typeof object === "string" && keys.length >= 1)
                || (typeof object !== "string" && keys.length < 1)
            ) {
                return false;
            }
            if (typeof object === "string" && keys.length < 1) {
                return object;
            }
            if (!validators.isPopulatedObject(object)) {
                return false;
            }

            let key = keys.shift();
            return iterate(object[key], keys);
        };

        return iterate(object, keys);
    },
    getRandomItemFromArray: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    }
};

module.exports = objectHelpers;