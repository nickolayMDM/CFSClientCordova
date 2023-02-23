import reducerBuilder from "../reducerBuilder";
import validators from "../helpers/validators";
import config from "../config";

let reducer = reducerBuilder({
    name: 'language',
    defaultState: config.defaultLangISO,
    validator: validators.isPopulatedString
});

export default reducer;