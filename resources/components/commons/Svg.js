import React, {Component} from 'react';
import request from "../../adapters/requestAdapter";
import DOMParserAdapter from "../../adapters/DOMParserAdapter";

import "../../styles/commons/Svg.scss";

class Svg extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewBox: "0, 0, 0, 0",
            paths: ""
        };
    }

    componentDidMount() {
        this.getInlinePaths();
    }

    componentDidUpdate(prevProps) {
        if (this.props.src !== prevProps.src) {
            this.getInlinePaths();
        }
    }

    async getInlinePaths() {
        const requestResult = await request.get({url: this.props.src});

        const document = DOMParserAdapter.parseFromString({
            string: requestResult.response
        });

        const svg = document.getElementsByTagName("svg")[0];
        const viewBox = svg.getAttribute("viewBox");
        const svgChildren = svg.children;
        let svgChildrenString = "";
        for (let key in svgChildren) {
            svgChildrenString += svgChildren[key].outerHTML;
        }

        this.setState({
            viewBox,
            paths: svgChildrenString
        });
    }

    getClassName() {
        let classNameArray = [];
        if (typeof this.props.className === "string") {
            classNameArray.push(this.props.className);
        }

        return classNameArray.join(" ");
    }

    render() {
        return (
            <svg {...this.props} className={this.getClassName()} width={this.props.width}
                 height={this.props.height} xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={this.state.viewBox}
                dangerouslySetInnerHTML={{__html: this.state.paths}}>
            </svg>
        );
    }
}

export default Svg;