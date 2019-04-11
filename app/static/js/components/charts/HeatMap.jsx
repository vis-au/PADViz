import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
// import * as chroma from 'chroma-js'
import withD3Renderer from '../../hocs/withD3Renderer';
import sizeMe from 'react-sizeme';


class HeatMap extends Component {
    constructor(props) {
        super(props);
        
    }
    // componentDidMount() {
    //     this.renderD3();
    // }

    render() {
        const { width, height } = this.props.size
        
        return (
            <div className="heatmap">
                {/* {this.props.chart} */}
                {width}
                {height}
            </div>
        )
    }

    renderD3() {

    }

}

// HeatMap.propTypes = {
//     size: PropTypes.shape({
//         width: PropTypes.number.isRequired,
//         height: PropTypes.number.isRequired,
//       })
// }

HeatMap.defaultProps = {
    chart: 'loading'
};

export default sizeMe({monitorHeight: true})(HeatMap);
// export default HeatMap;