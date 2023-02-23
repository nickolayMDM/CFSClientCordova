import React, {Component} from 'react';
import eventEmitter from "../../adapters/eventAdapter"
import serverRequester from "../../adapters/serverRequesterAdapter";
import sceneProvider from '../../providers/sceneProvider';
import validators from "../../helpers/validators";
import sortOptionProvider from "../../providers/sortOptionProvider";

import Scene from "../commons/Scene";
import PostCard from "../CardList/PostCard";
import FolderCard from "../CardList/FolderCard";
import SortOptionSelect from "../SortOptionSelect";

const sceneName = "searchList";

class SearchListScene extends Component {
    constructor(props) {
        super(props);

        eventEmitter.addListener("performSearch", async (searchQuery) => {
            await this.activateScene();
            await this._getContents(searchQuery);
            eventEmitter.emit("refreshTopMenuLabel", {override: "search"});
        });
        eventEmitter.addListener(sortOptionProvider.getEventName(), () => {
            if (sceneProvider.getCurrentSceneName() === sceneName) {
                eventEmitter.emit("performSearch");
            }
        });

        this.state = {
            isLoading: false,
            folders: [],
            posts: []
        };
        this.searchText = "";
    }

    activateScene() {
        sceneProvider.switchToScene({
            name: sceneName
        });
    }

    async _getContents(searchQuery) {
        this.setState({
            isLoading: true
        });
        if (validators.isPopulatedString(searchQuery)) {
            this.searchText = searchQuery
        }

        const requestResult = await serverRequester.getSearchedContent({
            search: this.searchText
        });

        if (validators.isOkStatus(requestResult.status)) {
            this.setState({
                folders: requestResult.response.folders,
                posts: requestResult.response.posts,
                isLoading: false
            });
        }
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

            return <FolderCard key={index} item={item} isLoading={isLoading} isSearch={true}/>
        });
    }

    _renderPosts() {
        if (typeof this.state.posts === "undefined" || !validators.isPopulatedArray(this.state.posts) || this.state.posts.length < 1) {
            return [];
        }

        return this.state.posts.map((item, index) => {
            return <PostCard key={index} item={item} isSearch={true}/>
        });
    }

    render() {
        return (
            <Scene name={sceneName} options={{}} className="card-list">
                {/*<div className="top-menu-sort-container">*/}
                {/*    <SortOptionSelect changeEventName="performSearch"/>*/}
                {/*</div>*/}
                {this._renderFolders()}
                {this._renderPosts()}
            </Scene>
        );
    }
}

export default SearchListScene;