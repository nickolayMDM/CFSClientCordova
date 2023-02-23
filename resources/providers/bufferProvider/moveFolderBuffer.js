import validators from "../../helpers/validators";

const TYPE = "move_folder";

let moveFolderBuffer = {
    isDataValid: ({data}) => {

    },
    setCurrentData: ({data}) => {
        if (!isDataValid({data})) {
            throw new Error("data for move folder buffer is invalid");
        }

        return {
            type: TYPE,
            data
        };
    },
    paste: () => {

    }
};

export default moveFolderBuffer;