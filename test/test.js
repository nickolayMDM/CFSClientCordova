const framework = require("./adapters/frameworkAdapter");
const browser = require("./adapters/browserAdapter");

const subjects = [
    "folder"
];

subjects.map((value) => {
    const browserInstance = browser({
        width: 1280,
        height: 700,
        show: true,
        waitTimeout: 6000
    });
    const subjectClass = require("./subjects/" + value);
    const subjectInstance = new subjectClass(framework, browserInstance);
    subjectInstance.execute();
    subjectInstance.clear();
});