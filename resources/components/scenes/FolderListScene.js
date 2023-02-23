import React, {Component} from 'react';
import validators from "../../helpers/validators";
import eventEmitter from "../../adapters/eventAdapter"
import serverRequester from "../../adapters/serverRequesterAdapter";
import folderProvider from '../../providers/folderProvider';
import sceneProvider from '../../providers/sceneProvider';
import sortOptionProvider from '../../providers/sortOptionProvider';

import Scene from "../commons/Scene";
import FolderCard from "../CardList/FolderCard";
import PostCard from "../CardList/PostCard";
import Loading from "./FolderListScene/Loading";

const sceneName = "folderList";

class FolderListScene extends Component {
    constructor(props) {
        super(props);

        eventEmitter.addListener("refreshCardList", async (item) => {
            await this.activateScene();
            const contentResponse = await this._getContents(item);
            eventEmitter.emit("refreshTopMenuLabel", {
                isEmpty: !(validators.isPositiveInteger(contentResponse.posts.length) || validators.isPositiveInteger(contentResponse.folders.length))
            });
            this.forceUpdate();
        });
        eventEmitter.addListener(sortOptionProvider.getEventName(), () => {
            if (sceneProvider.getCurrentSceneName() === sceneName) {
                eventEmitter.emit("refreshCardList");
            }
        });

        this.state = {
            isLoading: false,
            folderId: null,
            folders: [],
            posts: []
        };
    }

    activateScene() {
        sceneProvider.switchToScene({
            name: sceneName
        });
    }

    async _getContents(item) {
        let folderID = null;
        if (!validators.isDefined(item)) {
            folderID = folderProvider.getCurrentId();
        }
        if (validators.isPopulatedObject(item) && validators.isDefined(item.ID)) {
            folderID = item.ID;
        }

        folderProvider.setIsSwitchingFolder(true);
        this.setState({
            isLoading: true,
            folderId: folderID
        });
        const requestResult = await serverRequester.getContents({
            folder: folderID
        });

        this.setState({
            folders: requestResult.response.folders,
            posts: requestResult.response.posts,
            isLoading: false
        });
        folderProvider.setIsSwitchingFolder(false);
        folderProvider.setCurrentFolderData({
            item: requestResult.response.item,
            parent: requestResult.response.parent
        });

        return requestResult.response;
    }

    _renderFolders() {
        if (typeof this.state.folders === "undefined" || this.state.folders.length < 1) {
            return [];
        }

        return this.state.folders.map((item, index) => {
            let isLoading = false;
            if (this.state.isLoading && this.state.folderId === item.ID) {
                isLoading = true;
            }

            return <FolderCard key={index} item={item} isLoading={isLoading}/>
        });
    }

    _renderPosts() {
        if (typeof this.state.posts === "undefined" || this.state.posts.length < 1) {
            return [];
        }

        const foldersCount = this.state.folders.length;
        return this.state.posts.map((item, index) => {
            return <PostCard key={foldersCount + index} item={item}/>
        });
    }

    async componentDidMount() {
        await this._getContents();
    }

    render() {
        return (
            <Scene name={sceneName} options={{activate: this.props.activate}} className="card-list">
                <Loading isLoading={this.state.isLoading}/>
                {this._renderFolders()}
                {this._renderPosts()}
            </Scene>
        );
    }
}

export default FolderListScene;