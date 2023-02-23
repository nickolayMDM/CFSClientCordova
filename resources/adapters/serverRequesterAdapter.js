let _requestAdapter, _storage, _translator, _sortOptionProvider, host, appAuthString;
let appDeviceString = "";

const getDefaultHeaders = async () => {
    const appUserString = await _storage.get({
        key: "appUserString"
    });
    return {
        "app-auth-string": appAuthString,
        "app-user-string": appUserString,
        "app-device-string": appDeviceString
    };
};

//TODO: break up into categories
const serverRequester = {
    initialize: async ({requestAdapter, sortOptionProvider, config, isPopulatedObject, storage, translator}) => {
        _requestAdapter = requestAdapter;
        _storage = storage;
        _translator = translator;
        _sortOptionProvider = sortOptionProvider;

        host = config.serverApi.host;
        appAuthString = config.serverApi.authString;
        if (isPopulatedObject(device)) {
            appDeviceString = device.serial;
        }
    },

    authorize: async () => {
        let headers = await getDefaultHeaders();

        return await _requestAdapter.get({
            url: host + "authorize",
            headers,
            options: {
                notifyOnError: true
            }
        });
    },
    getOwnUser: async () => {
        let headers = await getDefaultHeaders();

        return await _requestAdapter.get({
            url: host + "getOwnUser",
            headers,
            options: {
                notifyOnError: true
            }
        });
    },
    addPasswordAuthorizationToUser: async ({name, email, password}) => {
        let params = {
            name,
            email,
            password
        };
        let headers = await getDefaultHeaders();

        return await _requestAdapter.put({
            url: host + "addPasswordAuthorizationToUser",
            headers,
            params,
            options: {
                notifyOnError: false
            }
        });
    },
    getUserByPassword: async ({name, password}) => {
        let params = {
            name,
            password
        };
        let headers = await getDefaultHeaders();

        return await _requestAdapter.get({
            url: host + "getUserByPassword",
            headers,
            params,
            options: {
                notifyOnError: false
            }
        });
    },
    mergeUserWithCurrent: async ({userID}) => {
        let params = {
            user: userID
        };
        let headers = await getDefaultHeaders();

        return await _requestAdapter.put({
            url: host + "mergeUserWithCurrent",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    setUserLanguage: async ({language}) => {
        let params = {
            language
        };
        let headers = await getDefaultHeaders();

        return await _requestAdapter.put({
            url: host + "setUserLanguage",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },

    getContents: async ({folder}) => {
        let params = {
            sortBy: _sortOptionProvider.getCurrentSortOption()
        };
        if (typeof folder !== "undefined") {
            params.folder = folder;
        }
        let headers = await getDefaultHeaders();

        return await _requestAdapter.get({
            url: host + "getFolderContents",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    postFolder: async ({name, parent}) => {
        let params = {
            name
        };
        if (typeof parent !== "undefined") {
            params.parent = parent;
        }
        let headers = await getDefaultHeaders();

        return await _requestAdapter.post({
            url: host + "postFolder",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    renameFolder: async ({name, folder}) => {
        let params = {
            name,
            folder
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "renameFolder",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    deleteFolder: async ({folder}) => {
        let params = {
            folder
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.del({
            url: host + "deleteFolder",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    setFolderPin: async ({folder, pin}) => {
        let params = {
            folder,
            pin
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "setFolderPin",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },

    getInputDetails: async ({input}) => {
        let params = {
            input
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.get({
            url: host + "getInputDetails",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    getSearchedContent: async ({search}) => {
        let params = {
            search,
            sortBy: _sortOptionProvider.getCurrentSortOption()
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.get({
            url: host + "getSearchedContent",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    addPost: async ({url, data, name, note, folder, provider}) => {
        let params = {
            url,
            data,
            name,
            note,
            folder,
            provider
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.post({
            url: host + "addPost",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    renamePost: async ({name, post}) => {
        let params = {
            name,
            post
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "renamePost",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    deletePost: async ({post}) => {
        let params = {
            post
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.del({
            url: host + "deletePost",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    setPostPin: async ({post, pin}) => {
        let params = {
            post,
            pin
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "setPostPin",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    setPostNote: async ({post, note}) => {
        let params = {
            post,
            note
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "setPostNote",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    getSimpleFolderTree: async () => {
        let headers = await getDefaultHeaders();

        const requestResult = await _requestAdapter.get({
            url: host + "getSimpleFolderTree",
            headers,
            options: {
                notifyOnError: true
            }
        });

        requestResult.response.name = _translator.translate(requestResult.response.name, "General");

        return requestResult;
    },
    moveFolder: async ({folder, parent}) => {
        let params = {
            folder,
            parent
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "moveFolder",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
    movePost: async ({post, folder}) => {
        let params = {
            post,
            folder
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "movePost",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },

    payForPremium: async ({status, details}) => {
        let params = {
            status,
            details
        };
        let headers = await getDefaultHeaders();

        return _requestAdapter.put({
            url: host + "payForPremium",
            headers,
            params,
            options: {
                notifyOnError: true
            }
        });
    },
};

export default serverRequester;