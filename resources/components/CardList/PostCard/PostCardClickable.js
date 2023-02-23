import React, {Component} from 'react';
import validators from "../../../helpers/validators";

const defaultTimeoutDurationMS = 500;

class PostCardClickable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isHolding: false,
            touchTimeoutID: 0
        };
    }

    getTimeoutDuration() {
        return (validators.isInt(this.props.timeoutDurationMS)) ? this.props.timeoutDurationMS : defaultTimeoutDurationMS;
    }

    openContextMenu() {
        if (typeof this.props.onOpenContextMenu === "function") {
            this.props.onOpenContextMenu();
        }

        this.endContextTimeout();
    }

    startContextTimeout() {
        if (this.state.isHolding) {
            return;
        }

        const touchTimeoutID = setTimeout(this.openContextMenu.bind(this), this.getTimeoutDuration());

        this.setState({
            isHolding: true,
            touchTimeoutID: touchTimeoutID
        });
    }

    endContextTimeout() {
        clearTimeout(this.state.touchTimeoutID);

        this.setState({
            isHolding: false,
            touchTimeoutID: 0
        });
    }

    onTouchStart() {
        this.startContextTimeout();
    }

    onTouchMove() {
        this.endContextTimeout();
    }

    onTouchEnd() {
        this.endContextTimeout();
    }

    render() {
        if (!this.props.clickable) {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }

        return (
            <a
                className="post-card-clickable"
                target="_blank"
                href={this.props.url}
                onTouchStart={this.onTouchStart.bind(this)}
                onTouchMove={this.onTouchMove.bind(this)}
                onTouchEnd={this.onTouchEnd.bind(this)}
            >
                {this.props.children}
            </a>
        );
    }
}

export default PostCardClickable;