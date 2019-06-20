import React, {Component} from 'react';
import styled from 'styled-components';
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';

import MultipleLines from '../containers/MultipleLines';
import DiffHeatMap from '../containers/DiffHeatMap';
import DiffScatterPlot from '../containers/DiffScatterPlot';
import StatScatterPlot from '../containers/StatScatterPlot';

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
            "spa_col3": "/data/lines?k=2&dist=LM&rep=median",

            "hm_col1": "/data/hm?wsize=5&step=3",
            "hm_col2": "/data/hm?k=2&dist=LM&rep=mean",
            "hm_col3": "/data/hm?k=2&dist=LM&rep=median",

            "stat_col1": "/data/stat",
            "stat_col2": "/data/stat?k=2&dist=LM&rep=mean",
            "stat_col3": "/data/stat",

            "diff_col1": "/data/diff",
            "diff_col2": "/data/diff?k=2&dist=LM&rep=mean",
            "diff_col3": "/data/diff?k=2&dist=LM&rep=median",
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
                        <div key="SPA_COL3">
                            <MultipleLines width="1400" height="430" name="col3-mulline"
                            initurl={this.state.initurls["spa_col3"]}/>
                        </div>

                        <div key="HM_COL1">
                            <DiffHeatMap width="1400" height="430" name="col1-diffhm" 
                            initurl={this.state.initurls["hm_col1"]}/>
                        </div>
                        <div key="HM_COL2">
                            <DiffHeatMap width="1400" height="430" name="col2-diffhm" 
                            initurl={this.state.initurls["hm_col2"]}/>
                        </div>
                        <div key="HM_COL3">
                            <DiffHeatMap width="1400" height="430" name="col3-diffhm" 
                            initurl={this.state.initurls["hm_col3"]}/>
                        </div>

                        <div key="SCA1_COL1">
                            <StatScatterPlot width="400" height="430" name="col1-stat"
                            initurl={this.state.initurls["stat_col1"]}/>
                        </div>
                        <div key="SCA1_COL2">
                            <StatScatterPlot width="400" height="430" name="col2-stat"
                            initurl={this.state.initurls["stat_col2"]}/>
                        </div>
                        <div key="SCA1_COL3">
                            <StatScatterPlot width="400" height="430" name="col3-stat"
                            initurl={this.state.initurls["stat_col3"]}/>
                        </div> 

                        <div key="SCA2_COL1">
                            <DiffScatterPlot width="400" height="430" name="col1-diff"
                            initurl={this.state.initurls["diff_col1"]}/>
                        </div>
                        <div key="SCA2_COL2" >
                            <DiffScatterPlot width="400" height="430" name="col2-diff"
                            initurl={this.state.initurls["diff_col2"]}/>
                        </div>
                        <div key="SCA2_COL3">
                            <DiffScatterPlot width="400" height="430" name="col3-diff"
                            initurl={this.state.initurls["diff_col3"]}/>
                        </div>
                        
                        
                        
                        
                </Grid>
                
            </React.Fragment>
        )
    }
}

export default Dashboard1;