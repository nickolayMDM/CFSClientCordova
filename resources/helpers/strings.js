const validators = require("./validators");

let textHelpers = {
    replacePlaceholder: ({body, name, replacement}) => {
        if (typeof body !== "string" || typeof name !== "string") return body;
        if (typeof replacement === "number") {
            replacement = "" + replacement;
        }
        if (Array.isArray(replacement) || validators.isObject(replacement)) {
            replacement = JSON.stringify(replacement);
            replacement = encodeURI(replacement);
        }
        if (typeof replacement !== "string") {
            return body;
        }

        let replaceString = "{" + name + "}";
        return body.replace(replaceString, replacement);
    },

    replacePlaceholders: ({body, replacements}) => {
        if (typeof body !== "string" || typeof replacements !== "object") return body;

        for (let key in replacements) {
            if (!replacements.hasOwnProperty(key)) continue;
            let value = replacements[key];

            body = textHelpers.replacePlaceholder({
                body,
                name: key,
                replacement: value
            });
        }

        return body;
    },

    trimSpaces: (text) => {
        text = text.trim();
        text = text.replace(/\s\s+/g, " ");

        return text;
    }
};

module.exports = textHelpers;