import React, {Component} from 'react';
import eventEmitter from "../adapters/eventAdapter";

import "../styles/ControlMenu.scss";

import HomeButton from "./ControlMenu/HomeButton";
import SearchButton from "./ControlMenu/SearchButton";
import AddFolderButton from "./ControlMenu/AddFolderButton";
import AddPostButton from "./ControlMenu/AddPostButton";
import UpgradeButton from "./ControlMenu/UpgradeButton";
import SearchInput from "./ControlMenu/SearchInput";

class ControlMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearchInputShown: false,
            searchInputHeight: 0
        };

        this.searchInputRef = React.createRef();

        eventEmitter.addListener("toggleSearchInput", this.toggleSearchInput.bind(this));
        eventEmitter.addListener("moveFolder", this.hideSearchInput.bind(this));
    }

    hideSearchInput() {
        if (!this.state.isSearchInputShown) {
            return;
        }

        this.setState({
            isSearchInputShown: false
        });
    }

    toggleSearchInput() {
        let newState = {
            isSearchInputShown: !this.state.isSearchInputShown
        };

        if (!this.state.isSearchInputShown) {
            newState.searchInputHeight = this.searchInputRef.current.containerRef.current.offsetHeight;
        } else {
            eventEmitter.emit("refreshCardList");
        }

        this.setState(newState);
    }

    getContainerStyle() {
        let style = {};

        if (this.state.isSearchInputShown && this.state.searchInputHeight > 0) {
            style.paddingTop = this.state.searchInputHeight;
        }

        return style;
    }

    render() {
        return (
            <div style={this.getContainerStyle()} className="control-menu">
                <div className="control-menu-buttons-container">
                    <HomeButton/>
                    <SearchButton/>
                    <AddFolderButton/>
                    <AddPostButton/>
                    <UpgradeButton/>
                </div>

                <SearchInput ref={this.searchInputRef}/>
            </div>
        );
    }
}

export default ControlMenu;