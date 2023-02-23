import React, {Component} from 'react';
import modalProvider from '../../providers/modalProvider';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";

import Svg from "../commons/Svg";

import addPostImage from "../../images/ControlMenu/addLink.svg";

class AddPostButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    openFindPostModal() {
        modalProvider.switchToModal({name: "findPost"});
    }

    render() {
        return (
            <div className="add-post-button" onClick={this.openFindPostModal}>
                <Svg src={addPostImage} width="30" height="30" />
                <p className="description-text">{translate("Add Video", "Actions")}</p>
            </div>
        );
    }
}

export default AddPostButton;