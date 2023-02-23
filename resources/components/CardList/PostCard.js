import React, {Component} from 'react';
import validators from "../../helpers/validators";
import config from "../../config";
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import PostCardClickable from "./PostCard/PostCardClickable";
import Menu from "../commons/Menu";
import PinButton from "./PostCard/PinButton";
import RenameButton from "./PostCard/RenameButton";
import DeleteButton from "./PostCard/DeleteButton";
import SetNoteButton from "./PostCard/SetNoteButton";
import MoveButton from "./PostCard/MoveButton";
import Svg from "../commons/Svg";

import "../../styles/CardList/Card.scss";
import "../../styles/CardList/PostCard.scss";

import folderImage from "../../images/TopMenu/folder.svg";
import pinImage from "../../images/CardList/pinFilled.svg";
import tiktokImage from "../../images/CardList/PostCard/tiktok.svg";
import youtubeImage from "../../images/CardList/PostCard/youtube.svg";
import redditImage from "../../images/CardList/PostCard/reddit.svg";

/**
 * props:
 * editable - boolean
 * clickable - boolean
 * item - object
 * isSearch - boolean
 * customNoteAction - function
 */
class PostCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaceholderImage: false,
            imageSrc: null,
            placeholderImageClass: ""
        };

        applyTranslationUpdates(this);

        this.contextMenuRef = React.createRef();
    }

    async componentDidMount() {
        await this.setImage();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.item.image !== prevProps.item.image) {
            await this.setImage();
        }
    }

    toggleContextMenu() {
        this.contextMenuRef.current.toggleMenu();
    }

    async setImage() {
        let source = config.serverApi.host + "public/images/postThumbnails/" + this.props.item.ID + "/small163.jpeg";
        this.setState({
            isPlaceholderImage: false,
            imageSrc: source
        });
    }

    setImagePlaceholder() {
        let newState = {
            isPlaceholderImage: true
        };
        switch (this.props.item.provider) {
            case "youtube":
                newState.imageSrc = youtubeImage;
                newState.placeholderImageClass = "svg-youtube";
                break;
            case "tiktok":
                newState.imageSrc = tiktokImage;
                newState.placeholderImageClass = "svg-white";
                break;
            case "reddit":
                newState.imageSrc = redditImage;
                newState.placeholderImageClass = "svg-reddit";
                break;
        }

        this.setState(newState);
    }

    _renderImage() {
        if (!validators.isPopulatedObject(this.props.item)) {
            return this._renderClickable();
        }

        if (this.state.isPlaceholderImage) {
            return this._renderClickable((
                <div className="image-wrapper">
                    <Svg key={0} className={this.state.placeholderImageClass} src={this.state.imageSrc} width="80"/>
                </div>
            ));
        }

        return this._renderClickable((
            <div className="image-wrapper">
                {this._renderProviderImage()}
                <img key={0} className="image" src={this.state.imageSrc} onError={this.setImagePlaceholder.bind(this)}
                     alt={this.props.item.name}/>
            </div>
        ));
    }

    _renderIndicators() {
        if (this.props.editable === false || this.props.isSearch === true || !this.props.item.isPinned) {
            return <div className="indicators"/>;
        }

        return (
            <div className="indicators">
                <Svg src={pinImage} width="17" height="17"/>
            </div>
        );
    }

    _renderNote() {
        if (validators.isString(this.props.item.note) && this.props.item.note.length > 0) {
            return this._renderClickable((
                <div className="post-note">{this.props.item.note}</div>
            ), 1);
        }

        return (
            <SetNoteButton item={this.props.item} hideIcon={true} className="button-contained"
                           customNoteAction={this.props.customNoteAction}/>
        );
    }

    _renderClickable(children, key) {
        if (!validators.isInt(key)) {
            key = 0;
        }

        return (
            <PostCardClickable key={key} url={this.props.item.url} clickable={this.props.clickable || true}
                               onOpenContextMenu={this.toggleContextMenu.bind(this)}>
                {children}
            </PostCardClickable>
        );
    }

    _renderComponentContainer() {
        const componentContainerChildren = [
            this._renderImage(),
            <div key={1} className="text-container">
                {this._renderClickable([
                    <p key={0} className="name">{this.props.item.name}</p>,
                    <p key={1} className="author">{translate("by", "General")} {this.props.item.author}</p>
                ])}
                {this._renderNote()}
            </div>
        ];

        return (
            <div className="component-container">
                {componentContainerChildren}
            </div>
        );
    }

    _renderContextMenu() {
        return (
            <Menu ref={this.contextMenuRef}>
                <PinButton ID={this.props.item.ID} isPinned={this.props.item.isPinned}
                           callback={this.toggleContextMenu.bind(this)}
                           className="button-link button-link-black button-contained"/>
                <SetNoteButton item={this.props.item} callback={this.toggleContextMenu.bind(this)}
                               className="button-link button-link-black button-contained"/>
                <RenameButton item={this.props.item} callback={this.toggleContextMenu.bind(this)}
                              className="button-link button-link-black button-contained"/>
                <MoveButton item={this.props.item} callback={this.toggleContextMenu.bind(this)}
                            className="button-link button-link-black button-contained"/>
                <DeleteButton ID={this.props.item.ID} callback={this.toggleContextMenu.bind(this)}
                              className="button-link button-link-black button-contained"/>
            </Menu>
        );
    }

    _renderFolderData() {
        if (this.props.isSearch !== true || typeof this.props.item.folder === "undefined") {
            return "";
        }

        return (
            <div className="post-folder">
                <Svg src={folderImage} width="21" height="17"/>
                <p>{this.props.item.folder.name}</p>
            </div>
        );
    }

    _renderProviderImage() {
        if (this.props.item.provider === "youtube") {
            return (
                <Svg src={youtubeImage} className="provider-icon-youtube" width="20" height="20"/>
            );
        }
        if (this.props.item.provider === "tiktok") {
            return (
                <Svg src={tiktokImage} className="provider-icon-tiktok" width="20" height="20"/>
            );
        }

        return "";
    }

    getClassName() {
        let className = "card post-card";

        if (this.props.isSearch === true) {
            className += " post-card-with-folder";
        }

        return className;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                {this._renderFolderData()}
                {this._renderComponentContainer()}
                {this._renderIndicators()}
                {this._renderContextMenu()}
            </div>
        );
    }
}

export default PostCard;