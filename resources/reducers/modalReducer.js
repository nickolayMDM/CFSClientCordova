import reducerBuilder from "../reducerBuilder";
import validators from "../helpers/validators";

let reducer = reducerBuilder({
    name: 'modal',
    defaultState: "",
    validator: validators.isPopulatedString
});

export default reducer;