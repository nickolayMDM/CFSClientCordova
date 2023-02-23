import React, {Component} from 'react';
import eventEmitter from "../adapters/eventAdapter"
import config from "../config";

import "../styles/Debug.scss";

class Debug extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: config.serverApi.host
        };

        eventEmitter.addListener("d_authorize", async (authorize) => {
            this.setState({
                text: JSON.stringify(authorize)
            });
        });
    }

    render() {
        return (
            <div className="debug">
                {this.state.text}
            </div>
        );
    }
}

export default Debug;