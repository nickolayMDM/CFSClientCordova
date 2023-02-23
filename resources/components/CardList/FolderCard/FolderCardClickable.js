import React, {Component} from 'react';
import validators from "../../../helpers/validators";

const defaultTimeoutDurationMS = 500;

class FolderCardClickable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isHolding: false,
            touchTimeoutID: 0,
            touchStartTimestamp: 0
        };
    }

    getTimeoutDuration() {
        return (validators.isInt(this.props.timeoutDurationMS)) ? this.props.timeoutDurationMS : defaultTimeoutDurationMS;
    }

    openContextMenu() {
        if (typeof this.props.onOpenContextMenu === "function") {
            this.props.onOpenContextMenu();
        }
    }

    startTouchTimeout() {
        if (this.state.isHolding) {
            return;
        }

        const touchTimeoutID = setTimeout(this.openContextMenu.bind(this), this.getTimeoutDuration());

        this.setState({
            isHolding: true,
            touchTimeoutID: touchTimeoutID,
            touchStartTimestamp: Date.now()
        });
    }

    endTouchTimeout({forceCancel = false} = {}) {
        if (Date.now() - this.state.touchStartTimestamp < defaultTimeoutDurationMS && !forceCancel) {
            this.props.onClick();
        }

        clearTimeout(this.state.touchTimeoutID);

        this.setState({
            isHolding: false,
            touchTimeoutID: 0
        });
    }

    onTouchStart() {
        this.startTouchTimeout();
    }

    onTouchMove() {
        this.endTouchTimeout({
            forceCancel: true
        });
    }

    onTouchEnd() {
        this.endTouchTimeout();
    }

    getClassName() {
        let className = "folder-card-clickable";
        if (validators.isPopulatedString(this.props.className)) {
            className += " " + this.props.className;
        }

        return className;
    }

    render() {
        if (this.props.clickable === false) {
            return (
                <div className={this.getClassName()}>
                    {this.props.children}
                </div>
            );
        }

        return (
            <div
                className={this.getClassName()}
                onTouchStart={this.onTouchStart.bind(this)}
                onTouchMove={this.onTouchMove.bind(this)}
                onTouchEnd={this.onTouchEnd.bind(this)}
            >
                {this.props.children}
            </div>
        );
    }
}

export default FolderCardClickable;