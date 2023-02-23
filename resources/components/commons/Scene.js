import React, {Component} from 'react';
import sceneProvider from "../../providers/sceneProvider";
import eventEmitter from "../../adapters/eventAdapter";

import "../../styles/commons/Scene.scss";

/**
 * props:
 * name
 * options (check SceneProvider for available options)
 */
class Scene extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShown: !!(this.props.options.activate) || false
        };

        sceneProvider.defineScene(this.props.name, this.props.options);
        eventEmitter.addListener(sceneProvider.getEventName(), this.switchScene.bind(this));
    }

    switchScene() {
        const currentScene = sceneProvider.getCurrentSceneName();

        if (currentScene === this.props.name) {
            return this.showScene();
        }

        return this.hideScene();
    }

    hideScene() {
        this.setState({
            isShown: false
        });
    }

    showScene() {
        this.setState({
            isShown: true
        });
    }

    getClassName() {
        let classNameString = "scene scene-" + this.props.name;
        if (!this.state.isShown) {
            classNameString += " hidden";
        }
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }
}

export default Scene;