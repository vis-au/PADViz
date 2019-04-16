import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { withSize } from 'react-sizeme'

import OriHeatMap from '../containers/OriHeatMap';
import OriStatScatter from '../containers/OriStatScatter';
import OriAmpScatter from '../containers/OriAmpScatter';
import OriSpaghetti from '../containers/OriSpaghetti';
import S2HeatMap from '../containers/S2HeatMap';

const GridLayout = WidthProvider(ReactGridLayout)


const withSizeHOC = withSize();
const SizedOriHeatMap = withSizeHOC(OriHeatMap);
const SizedOriStaScatter = withSizeHOC(OriStatScatter);
const SizedOriAmpScatter = withSizeHOC(OriAmpScatter);
const SizedSpaghetti = withSizeHOC(OriSpaghetti);
const SizedS2HeatMap = withSizeHOC(S2HeatMap);

const Box = styled.div`
    
    width: 100%;
    
`;

const generateHoverCss = index => `
    .data-${index} {
        opacity: 1;
        -webkit-transition: opacity .2s ease-in;
    }
`;

const Grid = styled(GridLayout)`
    min-width: 2800px;
    .axis path,
    .axis line {
        fill: none;
        shape-rendering: crispEdges;
    }
    .data {
        opacity: ${({hover}) => (hover ? 0.25 : 1)};
        -webkit-transition: opacity .2s ease-in;
    }
    ${({hover}) => hover && hover.map(index => generateHoverCss(index))}

    .tooltip {
        position: absolute;
        z-index: 10;
        display: inline-block;
        border: solid 1px;
        border-radius: 2px;
        padding: 5px;
        
        text-align: center;
        
      }
`;


class Dashboard extends Component {

    componentDidMount() {
        // window.addEventListener('resize', this.onWindowResize);
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        // window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize(e) {
        // this.forceUpdate()
        // console.log('resize')
    }
    
    onLayoutChange(layout) {
        // this.props.onLayoutChange(layout);
    }

    render() {
        const { hover } = this.props;
        const layout = [
            {i: 'HM_ORI', x: 0, y: 0, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1', x: 1, y: 9, w: 2, h: 4, maxW: 4},
            {i: 'SCA2', x: 3, y: 9, w: 2, h: 4},
            {i: 'SPA', x: 0, y: 4, w: 6, h: 4},

            {i: 'HM_PAD', x: 7, y: 0, w: 6, h: 4},
            {i: 'SCA1_PAD', x: 6, y: 4, w: 3, h: 3},
            {i: 'SCA2_PAD', x: 10, y: 4, w: 3, h: 3},
            {i: 'SPA_PAD', x: 7, y: 9, w: 6, h: 4},
        ];

        return (
            <React.Fragment>
                <Grid 
                    className="dashboard" 
                    layout={layout} 
                    cols={12} 
                    rowHeight={100}
                    hover={hover} 
                    {...this.props}>
                    <Box key="HM_ORI"> 
                        <SizedOriHeatMap />
                        {/* <SizedHM /> */}
                        {/* <ConButton />
                        <ConItem /> */}
                    </Box>
                    <Box key="SPA">
                        {/* <SizedSpaghetti /> */}
                    </Box>
                    <Box key="SCA1">
                        {/* <SizedOriStaScatter /> */}
                    </Box>
                    <Box key="SCA2">
                        <SizedOriAmpScatter />
                    </Box>
                    

                    <Box key="HM_PAD">
                    <SizedS2HeatMap /> 
                    </Box>
                    <Box key="SCA1_PAD">SCA_PAD</Box>
                    <Box key="SCA2_PAD">SCA2_PAD</Box>
                    <Box key="SPA_PAD"></Box>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Dashboard;