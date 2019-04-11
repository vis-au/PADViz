import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { withContentRect } from 'react-measure'; 
import { withSize } from 'react-sizeme'

import OriStatScatter from '../containers/OriStatScatter';
import OriHM from '../containers/OriHM';

const GridLayout = WidthProvider(ReactGridLayout)
const Grid = styled(GridLayout)`
    min-width: 2800px;
`;

const MeasuredHeatMapOri = withContentRect('client')(OriHM);

const withSizeHOC = withSize()
const SizedHM = withSizeHOC(OriHM);

const Box = styled.div`
    box-sizing: border-box;
    width: 100%;
    border: solid #5B6DCD 4px;
`;



class Dashboard extends Component {

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize(e) {
        this.forceUpdate()
        // console.log('resize')
    }
    
    onLayoutChange(layout) {
        // this.props.onLayoutChange(layout);
    }

    render() {
        
        const layout = [
            {i: 'HM_ORI', x: 0, y: 0, w: 6, h: 4, minW: 5},
            {i: 'SCA1', x: 0, y: 4, w: 3, h: 4},
            {i: 'SCA2', x: 3, y: 4, w: 3, h: 4},
            {i: 'SPA', x: 0, y: 9, w: 6, h: 4},

            {i: 'HM_PAD', x: 7, y: 0, w: 6, h: 4},
            {i: 'SCA1_PAD', x: 6, y: 4, w: 3, h: 3},
            {i: 'SCA2_PAD', x: 10, y: 4, w: 3, h: 3},
            {i: 'SPA_PAD', x: 7, y: 9, w: 6, h: 4},
        ];

        return (
            <React.Fragment>
                <Grid className="dashboard" layout={layout} cols={12} rowHeight={100} onLayoutChange={this.onLayoutChange} {...this.props}>
                    <Box key="HM_ORI"> 
                        <SizedHM />
                    </Box>
                    <Box key="SCA1">
                        {/* <OriStatScatter /> */}
                    </Box>
                    <Box key="SCA2"></Box>
                    <Box key="SPA"></Box>

                    <Box key="HM_PAD"> 
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