import React, {Component} from 'react';

import Loading from "../../commons/Loading";

class FolderListSceneLoading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingClassName: "hidden",
        };

        this.loadingTimeout = 0;
        this.loadingTimeoutTime = 250;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoading && this.props.isLoading) {
            this.show();
        } else if (prevProps.isLoading && !this.props.isLoading) {
            this.hide();
        }
    }

    clearTimeout() {
        clearTimeout(this.loadingTimeout);
    }

    show() {
        this.clearTimeout();

        this.loadingTimeout = setTimeout(() => {
            this.setState({
                loadingClassName: "fade-in"
            });

            setTimeout(() => {
                this.setState({
                    loadingClassName: ""
                });
            }, 0);
        }, this.loadingTimeoutTime);
    }

    hide() {
        this.clearTimeout();

        this.setState({
            loadingClassName: "hidden"
        });
    }

    render() {
        return (
            <div className={"loading-overlay " + this.state.loadingClassName}>
                <Loading size="2x"/>
            </div>
        );
    }
}
export default FolderListSceneLoading;