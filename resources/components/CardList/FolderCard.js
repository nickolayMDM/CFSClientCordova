import React, {Component} from 'react';
import folderProvider from '../../providers/folderProvider';
import eventEmitter from "../../adapters/eventAdapter";

import folderImage from "../../images/CardList/FolderCard/folder.svg";
import emptyFolderImage from "../../images/CardList/FolderCard/folderEmpty.svg";
import pinImage from "../../images/CardList/pinFilled.svg";

import Menu from "../commons/Menu";
import FolderCardClickable from "./FolderCard/FolderCardClickable";
import PinButton from "./FolderCard/PinButton";
import RenameButton from "./FolderCard/RenameButton";
import MoveButton from "./FolderCard/MoveButton";
import DeleteButton from "./FolderCard/DeleteButton";
import Svg from "../commons/Svg";

import "../../styles/CardList/Card.scss";
import "../../styles/CardList/FolderCard.scss";

class FolderCard extends Component {
    constructor(props) {
        super(props);

        folderProvider.applyFolderUpdates(this);

        this.contextMenuRef = React.createRef();
    }

    toggleContextMenu() {
        this.contextMenuRef.current.toggleMenu();
    }

    openFolder() {
        folderProvider.switchFolder({
            item: this.props.item
        });
        eventEmitter.emit("moveFolder");
    }

    getImage() {
        if (this.props.item.isEmpty) {
            return emptyFolderImage;
        }

        return folderImage;
    }

    _renderPin() {
        if (this.props.editable === false || this.props.isSearch === true || !this.props.item.isPinned) {
            return "";
        }

        return (
            <Svg src={pinImage} width="17" height="17"/>
        );
    }

    _renderContextMenu() {
        return (
            <Menu ref={this.contextMenuRef}>
                <PinButton ID={this.props.item.ID} isPinned={this.props.item.isPinned}
                           callback={this.toggleContextMenu.bind(this)} className="button-link button-link-black button-contained"/>
                <RenameButton item={this.props.item} callback={this.toggleContextMenu.bind(this)}
                              className="button-link button-link-black button-contained"/>
                <MoveButton item={this.props.item} callback={this.toggleContextMenu.bind(this)}
                              className="button-link button-link-black button-contained"/>
                <DeleteButton ID={this.props.item.ID} callback={this.toggleContextMenu.bind(this)}
                              className="button-link button-link-black button-contained"/>
            </Menu>
        );
    }

    render() {
        return (
            <div className="card folder-card">
                <FolderCardClickable className="component-container" onClick={this.openFolder.bind(this)}
                                     onOpenContextMenu={this.toggleContextMenu.bind(this)}>
                    <Svg src={this.getImage()} width="42" height="34"/>
                    <p className="name">{this.props.item.name}</p>
                </FolderCardClickable>
                <div className="indicators">
                    {this._renderPin()}
                </div>
                {this._renderContextMenu()}
            </div>
        );
    }
}

export default FolderCard;