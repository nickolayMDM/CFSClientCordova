import validators from "./helpers/validators";

let reducerBuilder = function({name, defaultState, validator = null, extraCases = {}} = {}) {
    return function(state = defaultState, action) {
        switch (true) {
            case (action.type === name + '_set'):
                if (typeof validator === "function" && !validator(action.state)) {
                    return state;
                }

                return state = action.state;
            case (action.type.substr(0, name.length + 1) === name + "_"):
                //dynamic cases
                for (let key in extraCases) {
                    if (extraCases.hasOwnProperty(key) && action.type && action.type === name + "_" + key && validators.isFunction(extraCases[key])) {
                        return extraCases[key](state, action);
                    }
                }

                //default behavior
                return state;
            default:
                return state;
        }
    }
};

export default reducerBuilder;