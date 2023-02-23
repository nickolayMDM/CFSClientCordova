import React, {Component} from 'react';
import objectHelpers from "../../helpers/objects";

import advert1 from "../../images/_dev/advert1.gif";
import advert2 from "../../images/_dev/advert2.gif";
import advert3 from "../../images/_dev/advert3.gif";
import advert4 from "../../images/_dev/advert4.gif";
import advert5 from "../../images/_dev/advert5.gif";

const advertImageArray = [
    advert1,
    advert2,
    advert3,
    advert4,
    advert5
];

class AdvertPlaceholder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            advertImage: null
        };
    }

    componentDidMount() {
        this.pickAnAdvert();
    }

    pickAnAdvert() {
        this.setState({
            advertImage: objectHelpers.getRandomItemFromArray(advertImageArray)
        });
    }

    render() {
        return (
            <img src={this.state.advertImage}/>
        );
    }
}

export default AdvertPlaceholder;