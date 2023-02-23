import validators from "../../helpers/validators";
import React from "react";

const errorPrefix = "Module flattenTree error: ";

const DEFAULT_INDENT_STRING = "\u00A0\u00A0\u00A0\u00A0\u00A0";
const DEFAULT_OPTION_OUTPUT_VALUE_KEY = "value";
const DEFAULT_OPTION_OUTPUT_NAME_KEY = "name";
const DEFAULT_CHILDREN_KEY = "children";

const OUTPUT_OPTIONS = "options";
const OUTPUTS = [
    OUTPUT_OPTIONS
];

const TREE_TYPE_ROOT = "root";
const TREE_TYPE_ARRAY = "array";
const TREE_TYPES = [
    TREE_TYPE_ROOT,
    TREE_TYPE_ARRAY
];

export class flattenTree {
    constructor(
        {
            outputType = OUTPUT_OPTIONS,
            tree,
            excludedBranchValue,
            optionOutputValueKey = DEFAULT_OPTION_OUTPUT_VALUE_KEY,
            optionOutputNameKey = DEFAULT_OPTION_OUTPUT_NAME_KEY,
            indentString = DEFAULT_INDENT_STRING,
            childrenKey = DEFAULT_CHILDREN_KEY
        }
    ) {
        this.setOutputType(outputType);
        this.setOptionOutputValueKey(optionOutputValueKey);
        this.setOptionOutputNameKey(optionOutputNameKey);
        this.setIndentString(indentString);
        this.setChildrenKey(childrenKey);
        if (typeof tree !== "undefined") {
            this.setTree(tree);
        }
        if (typeof excludedBranchValue !== "undefined") {
            this.setExcludedBranchValue(excludedBranchValue);
        }
    }

    setExcludedBranchValue(excludedBranchValue) {
        if (!validators.isPopulatedString(excludedBranchValue)) {
            throw new Error(errorPrefix + "excluded branch value must be a non-empty string");
        }

        this.excludedBranchValue = excludedBranchValue;
    }

    setOutputType(outputType) {
        if (!validators.isWithin(outputType, OUTPUTS)) {
            throw new Error(errorPrefix + "output type must be within available options. To get the available options call getOutputOptions method");
        }

        this.outputType = outputType;
    }

    setOptionOutputValueKey(optionOutputValueKey) {
        if (!validators.isPopulatedString(optionOutputValueKey)) {
            throw new Error(errorPrefix + "option output value key must be a non-empty string");
        }

        this.optionOutputValueKey = optionOutputValueKey;
    }

    setOptionOutputNameKey(optionOutputNameKey) {
        if (!validators.isPopulatedString(optionOutputNameKey)) {
            throw new Error(errorPrefix + "option output name key must be a non-empty string");
        }

        this.optionOutputNameKey = optionOutputNameKey;
    }

    setIndentString(indentString) {
        if (!validators.isPopulatedString(indentString)) {
            throw new Error(errorPrefix + "indent string must be a non-empty string");
        }

        this.indentString = indentString;
    }

    setChildrenKey(childrenKey) {
        if (!validators.isPopulatedString(childrenKey)) {
            throw new Error(errorPrefix + "children key must be a non-empty string");
        }

        this.childrenKey = childrenKey;
    }

    setTree(tree) {
        if (validators.isPopulatedObject(tree)) {
            this.treeType = TREE_TYPE_ROOT;
            this.tree = tree;
            return;
        }
        if (validators.isPopulatedArray(tree)) {
            this.treeType = TREE_TYPE_ARRAY;
            this.tree = tree;
            return;
        }

        throw new Error(errorPrefix + "tree must either be a root object or an array of objects");
    }

    transform() {
        if (typeof this.tree === "undefined" || typeof this.treeType === "undefined") {
            throw new Error(errorPrefix + "please set a tree using setTree method before executing transformation");
        }

        switch (this.treeType) {
            case TREE_TYPE_ROOT:
                return rootTransform({
                    item: this.tree,
                    outputType: this.outputType,
                    excludedBranchValue: this.excludedBranchValue,
                    optionOutputValueKey: this.optionOutputValueKey,
                    optionOutputNameKey: this.optionOutputNameKey,
                    childrenKey: this.childrenKey,
                    indentString: this.indentString,
                });
            case TREE_TYPE_ARRAY:
                return arrayTransform({
                    array: this.tree,
                    outputType: this.outputType,
                    excludedBranchValue: this.excludedBranchValue
                });
        }

        throw new Error(errorPrefix + "unknown tree type, can not transform");
    }
}

export const getOutputTypes = () => {
    return OUTPUTS;
};

export default {
    build: flattenTree,
    getOutputTypes
};

const rootTransform = ({item, outputType, indentString, excludedBranchValue, optionOutputValueKey, optionOutputNameKey, childrenKey}) => {
    return itemWalk({
        item,
        outputType,
        indentString,
        excludedBranchValue,
        optionOutputValueKey,
        optionOutputNameKey,
        childrenKey
    });
};

const arrayTransform = ({}) => {
    throw new Error(errorPrefix + "array transform not yet implemented");
};

const addIndentationToFolderOptionName = ({name, indentIndex, indentString}) => {
    for (let key = 0; key < indentIndex; key++) {
        if (key >= 3) {
            break;
        }

        name = indentString + name;
    }

    return name;
};

const itemWalk = ({item, outputType, indentString, excludedBranchValue, optionOutputValueKey, optionOutputNameKey, childrenKey, indentIndex = 0, key = 0} = {}) => {
    if (
        !validators.isPopulatedObject(item)
        || (
            validators.isPopulatedString(excludedBranchValue)
            && item[optionOutputValueKey] === excludedBranchValue
        )
    ) {
        return null;
    }
    let result = [];

    result.push(walkOutput({item, outputType, indentString, indentIndex, key: key++, optionOutputValueKey, optionOutputNameKey}));

    if (validators.isPopulatedArray(item[childrenKey])) {
        item[childrenKey].map((value) => {
            const output = itemWalk({
                item: value,
                outputType,
                excludedBranchValue,
                indentString,
                optionOutputValueKey,
                optionOutputNameKey,
                childrenKey,
                indentIndex: indentIndex + 1,
                key: key++
            });

            if (validators.isNull(output)) {
                return;
            }

            result = [
                ...result,
                output
            ]
        });
    }

    return result;
};

const walkOutput = ({item, outputType, indentString, indentIndex, key, optionOutputValueKey, optionOutputNameKey}) => {
    switch (outputType) {
        case OUTPUT_OPTIONS:
            return outputAsOption({item, indentString, indentIndex, key, optionOutputValueKey, optionOutputNameKey});
    }

    throw new Error(errorPrefix + "unknown output type, can not transform");
};

const outputAsOption = ({item, indentString, indentIndex, key, optionOutputValueKey, optionOutputNameKey}) => {
    let value = item[optionOutputValueKey];
    let name = addIndentationToFolderOptionName({
        name: item[optionOutputNameKey],
        indentIndex,
        indentString
    });

    if (validators.isNull(value)) {
        value = "";
    }

    return <option key={key} value={value}>
        {name}
    </option>;
};