class folder {
    constructor(framework, browser) {
        this.framework = framework;
        this.browser = browser;
    }

    execute() {
        this.framework.describe('Folder subject test', () => {
            this._addRootFolder();
        });
    }

    clear() {

    }

    _addRootFolder() {
        this.framework.it("should add a root folder", async () => {
            const rootFolderName = "Root folder";

            await this.browser
                .goto('http://localhost:8000/index.html')
                .wait('.add-folder-button')
                .click('.add-folder-button')
                .wait('.modal-addFolder')
                .type('input.add-folder-name', rootFolderName)
                .click('button.add-folder-submit')
                .wait(2000)
                .evaluate(() => document.querySelector('.card-list').children)
                .then(children => {
                    console.log("children", children);
                    const doesRootFolderExist = children.reduce((accumulator, item) => {
                        console.log("item",item);
                        if (item.querySelector('.name').innerHTML === "WTF") {
                            return true;
                        }

                        return accumulator;
                    }, false);
                    console.log("doesRootFolderExist", doesRootFolderExist);
                    this.framework.equal(doesRootFolderExist, true, "could not find the root folder");
                })
        });
    }
}

module.exports = folder;