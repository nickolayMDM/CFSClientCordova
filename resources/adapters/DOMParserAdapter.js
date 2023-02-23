import validators from "../helpers/validators";

let parser;
let isInitialized = false;

const initialize = () => {
    if (parser instanceof DOMParser) {
        return;
    }

    parser = new DOMParser();
    isInitialized = true;
};

const parseFromString = ({string, mimeType}) => {
    if (!isInitialized) {
        initialize();
    }
    if (!validators.isPopulatedString(mimeType)) {
        mimeType = "text/html";
    }

    return parser.parseFromString(string, mimeType);
};

export default {parseFromString};