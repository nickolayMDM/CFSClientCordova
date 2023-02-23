import React, {Component} from 'react';
import request from "../adapters/requestAdapter";
import storage from "../adapters/storageAdapter";
import config from "../config";
import translator from "../adapters/translatorAdapter";
import serverRequester from "../adapters/serverRequesterAdapter";
import {Provider as ReduxProvider} from "react-redux";
import {createStore, combineReducers} from "redux";
import eventEmitter from "../adapters/eventAdapter"
import modalProvider from '../providers/modalProvider';
import folderProvider from '../providers/folderProvider';
import sceneProvider from '../providers/sceneProvider';
import colorModeProvider from '../providers/colorModeProvider';
import accountProvider from '../providers/accountProvider';
import sortOptionProvider from '../providers/sortOptionProvider';
import linkingAdapter from '../adapters/linkingAdapter';
import debugAdapter from '../adapters/debugAdapter';
import {NotificationContainer, notify} from '../adapters/notificationAdapter';
import objectHelpers from "../helpers/objects";
import stringHelpers from "../helpers/strings";
import validators from "../helpers/validators";

import "../styles/App.scss";
import 'react-toastify/dist/ReactToastify.min.css';

import modalReducer from '../reducers/modalReducer';
import folderReducer from '../reducers/folderReducer';
import accountReducer from '../reducers/accountReducer';
import colorModeReducer from '../reducers/colorModeReducer';

const combinedReducer = combineReducers({
    modal: modalReducer,
    folder: folderReducer,
    account: accountReducer,
    colorMode: colorModeReducer
});
let store = createStore(combinedReducer);

import AppContainer from "./AppContainer";
import TopMenu from "./TopMenu";
import FolderListScene from "./scenes/FolderListScene";
import SearchListScene from "./scenes/SearchListScene";
import UpgradeScene from "./scenes/UpgradeScene";
import UpgradeSuccessfulScene from "./scenes/UpgradeSuccessfulScene";
import ControlMenu from "./ControlMenu";
import AddFolderModal from "./modals/AddFolderModal";
import RenameFolderModal from "./modals/RenameFolderModal";
import DeleteFolderModal from "./modals/DeleteFolderModal";
import FindPostModal from "./modals/FindPostModal";
import AddPostModal from "./modals/AddPostModal";
import RenamePostModal from "./modals/RenamePostModal";
import DeletePostModal from "./modals/DeletePostModal";
import SetPostNoteModal from "./modals/SetPostNoteModal";
import LogInModal from "./modals/LogInModal";
import RegisterModal from "./modals/RegisterModal";
import MergeModal from "./modals/MergeModal";
import MoveFolderModal from "./modals/MoveFolderModal";
import MovePostModal from "./modals/MovePostModal";
import ChooseLanguageModal from "./modals/ChooseLanguageModal";
import ChooseSortOptionModal from "./modals/ChooseSortOptionModal";
import CreatedByModal from "./modals/CreatedByModal";
import AdvertModal from "./modals/AdvertModal";
import ModalBackground from "./commons/Modal/ModalBackground";
import Loading from "./commons/Loading";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLoad: true
        };

        eventEmitter.addListener("refreshUserData", async () => {
            await this._authorize();
            await this.getUser();
            eventEmitter.emit("refreshTopMenuLabel");
        });
    }

    async initializeTranslator({locale = ""}) {
        await translator.initialize({
            transformStringWithDelimitersToArray: objectHelpers.transformStringWithDelimitersToArray,
            findNestedPropertyInObject: objectHelpers.findNestedPropertyInObject,
            replacePlaceholders: stringHelpers.replacePlaceholders,
            validators,
            eventEmitter,
            serverRequester
        });
        translator.setAvailableLocales(config.locales);

        if (!validators.isPopulatedString(locale)) {
            locale = await storage.get({key: "langISO"});
        }
        if (!validators.isPopulatedString(locale)) {
            locale = config.defaultLangISO;
        }
        await translator.setLocale({
            localeCode: locale,
            updateServer: false
        });
    }

    async initializeColorModes({subscriptionType}) {
        let initialModes = {
            bright: {},
            dark: {
                subscriptionTypes: [
                    "premium"
                ]
            }
        };

        let initialColorMode = await storage.get({
            key: "colorMode"
        });
        if (validators.isWithin(initialColorMode, initialModes)) {
            initialModes[initialColorMode].activate = true;
        }

        colorModeProvider.initialize({
            dispatch: store.dispatch.bind(this),
            storage,
            initialModes,
            defaultMode: "bright",
            userSubscriptionType: subscriptionType,
            validators,
            eventEmitter
        });

        eventEmitter.addListener("updateAccount", () => {
            colorModeProvider.validateCurrentColorMode({
                userSubscriptionType: accountProvider.getSubscriptionType()
            });
        });
    }

    async initializeSortOptions() {
        let initialSortOptions = {
            name: {
                title: "Alphabetic"
            },
            date: {
                title: "Newest"
            },
            dateAsc: {
                title: "Oldest"
            },
        };

        let initialSortOption = await storage.get({
            key: sortOptionProvider.getStorageKey()
        });
        if (validators.isWithin(initialSortOption, initialSortOptions)) {
            initialSortOptions[initialSortOption].activate = true;
        }

        sortOptionProvider.initialize({
            eventEmitter,
            validators,
            storage,
            initialSortOptions,
            defaultOption: "name"
        });
    }

    async componentDidMount() {
        //any initialization that is more than a single function should be separated into a method
        debugAdapter.initialize(eventEmitter);
        sceneProvider.initialize({eventEmitter});
        modalProvider.initialize({
            dispatch: store.dispatch.bind(this),
            eventEmitter,
            validators
        });
        folderProvider.initialize({
            store: store,
            dispatch: store.dispatch.bind(this),
            eventEmitter,
            validators
        });
        await linkingAdapter.initialize({
            hosts: [
                "tiktok.com",
                "www.tiktok.com",
                "vm.tiktok.com",
                "youtu.be",
                "youtube.com",
                "www.youtube.com",
                "www.reddit.com",
                "reddit.com"
            ],
            eventEmitter,
            validators,
            serverRequester,
            debugAdapter
        });

        accountProvider.initialize({
            eventEmitter,
            validators,
            translator
        });

        this.initializeSortOptions();

        await serverRequester.initialize({
            requestAdapter: request,
            config,
            isPopulatedObject: validators.isPopulatedObject,
            storage,
            translator,
            sortOptionProvider
        });

        // await this._authorizeTest();
        await this._authorize();
        let user = await this.getUser();

        await this.initializeColorModes({
            subscriptionType: user.subscriptionType
        });

        await this.initializeTranslator({
            locale: user.language
        });

        this.setState({
            firstLoad: false
        });
    }

    async _authorize() {
        const requestResult = await serverRequester.authorize();
        eventEmitter.emit("d_authorize", requestResult);

        if (typeof requestResult.response.newUserString === "string") {
            await storage.set({
                key: "appUserString",
                value: requestResult.response.newUserString
            });
        }
    }

    // async _authorizeTest() {
    //     const staticAuthString = "8b75678d4063362d676d3cf85af55352,619e090cb763e8c9d16a42a8";
    //     await storage.set({
    //         key: "appUserString",
    //         value: staticAuthString
    //     });
    // }

    async getUser() {
        const requestResult = await serverRequester.getOwnUser();

        accountProvider.setFromObject(requestResult.response, {clearBefore: true});

        return requestResult.response;
    }

    _renderLoading() {
        return (
            <div id="app" className="app-mode-bright app-loading">
                <Loading size="2x"/>
            </div>
        );
    }

    _renderApp() {
        return (
            <ReduxProvider store={store}>
                <AppContainer>
                    <TopMenu/>
                    <FolderListScene activate={true}/>
                    <SearchListScene/>
                    <UpgradeScene/>
                    <UpgradeSuccessfulScene/>
                    <ControlMenu/>

                    <ModalBackground/>
                    <AddFolderModal/>
                    <RenameFolderModal/>
                    <DeleteFolderModal/>
                    <FindPostModal/>
                    <AddPostModal/>
                    <RenamePostModal/>
                    <DeletePostModal/>
                    <SetPostNoteModal/>
                    <LogInModal/>
                    <RegisterModal/>
                    <MergeModal/>
                    <MoveFolderModal/>
                    <MovePostModal/>
                    <ChooseLanguageModal/>
                    <ChooseSortOptionModal/>
                    <AdvertModal/>
                    <CreatedByModal/>
                </AppContainer>
            </ReduxProvider>
        );
    }

    _renderContents() {
        if (this.state.firstLoad) {
            return this._renderLoading();
        }

        return this._renderApp();
    }

    render() {
        return (
            <div>
                {/*<Debug />*/}
                {this._renderContents()}
                <NotificationContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                />
            </div>
        );
    }
}

export default App;