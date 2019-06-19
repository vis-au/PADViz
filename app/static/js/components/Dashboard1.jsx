import React, {Component} from 'react';
import styled from 'styled-components';
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';

import DiffHeatMap from './DiffHeatMap';
import MeanStdScatter from './MeanStdScatter';
import DiffScatterPlot from './DiffScatterPlot';
import MultipleLines from '../containers/MultipleLines';


const GridLayout = WidthProvider(ReactGridLayout)

const Grid = styled(GridLayout)`
    min-width: 4200px;
`;

class Dashboard1 extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        initurls: {
            "spa_col1": "/data/lines",
            "spa_col2": "/data/lines?k=2&dist=LM&rep=mean",
            "spa_col3": "/data/lines?k=2&dist=LM&rep=median"
        }
    }

    render() {
        const layout = [
            {i: 'SPA_COL1', x: 0, y: 0, w: 6, h: 4, static:true},
            {i: 'HM_COL1', x: 0, y: 4, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1_COL1', x: 1, y: 8, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2_COL1', x: 3, y: 8, w: 2, h: 4, static:true},
            
            {i: 'SPA_COL2', x: 6, y: 0, w: 6, h: 4, static:true},
            {i: 'HM_COL2', x: 6, y: 4, w: 6, h: 4, static:true},
            {i: 'SCA1_COL2', x: 7, y: 8, w: 2, h: 4, static:true},
            {i: 'SCA2_COL2', x: 9, y: 8, w: 2, h: 4, static:true},
            
            {i: 'SPA_COL3', x: 12, y: 0, w: 6, h: 4, static:true},
            {i: 'HM_COL3', x: 12, y: 4, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1_COL3', x: 13, y: 8, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2_COL3', x: 15, y: 8, w: 2, h: 4, static:true},
        ];

        return (
            <React.Fragment>
                <Grid
                    className="dashboard"
                    layout={layout} 
                    cols={18} 
                    rowHeight={100}
                    {...this.props}>
                        <div key="SPA_COL1" >
                            <MultipleLines width="1400" height="430" name="col1-mulline"
                            initurl={this.state.initurls["spa_col1"]} />
                        </div>
                        <div key="SPA_COL2">
                            <MultipleLines width="1400" height="430" name="col2-mulline" 
                            initurl={this.state.initurls["spa_col2"]}/> 
                        </div>
                        {/* <div key="SPA_COL3">
                            <MultipleLines width="1400" height="430" name="col3-mulline"
                            initurl={this.state.initurls["spa_col3"]}/>
                        </div> */}

                        <div key="HM_COL1">
                            <DiffHeatMap key="HM_COL1" width="1400" height="430"/>
                        </div>
                        <div key="HM_COL2">

                        </div>
                        <div key="HM_COL3">

                        </div>
                        
                        {/* <MeanStdScatter key="SCA1_COL1" width="400" height="430"/> */}
                        {/* <DiffScatterPlot key="SCA2_COL1" width="400" height="430"/> */}
                </Grid>
                
            </React.Fragment>
        )
    }
}

export default Dashboard1;