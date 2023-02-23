import reducerBuilder from "../reducerBuilder";
import colorModeProvider from "../providers/colorModeProvider";

let reducer = reducerBuilder({
    name: 'colorMode',
    defaultState: "",
    validator: (state) => {
        return colorModeProvider.isModeValid(state);
    }
});

export default reducer;