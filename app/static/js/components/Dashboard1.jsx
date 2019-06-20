import React, {Component} from 'react';
import styled from 'styled-components';
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Navbar, Nav, Form, InputGroup, FormControl, Button, NavDropdown, NavItem} from 'react-bootstrap';

import MultipleLines from '../containers/MultipleLines';
import DiffHeatMap from '../containers/DiffHeatMap';
import DiffScatterPlot from '../containers/DiffScatterPlot';
import StatScatterPlot from '../containers/StatScatterPlot';
import { event } from 'd3-selection';
import { timingSafeEqual } from 'crypto';

const GridLayout = WidthProvider(ReactGridLayout)

const Grid = styled(GridLayout)`
    min-width: 4200px;
`;

class Dashboard1 extends Component {
    constructor(props) {
        super(props);

        this.setwsize = this.setwsize.bind(this);

        this.setCol2K = this.setCol2K.bind(this);
        this.setCol2Dist = this.setCol2Dist.bind(this);
        this.setCol2Rep = this.setCol2Rep.bind(this);
        this.handlecol2update = this.handlecol2update.bind(this);

        this.setCol3K = this.setCol3K.bind(this);
        this.setCol3Dist = this.setCol3Dist.bind(this);
        this.setCol3Rep = this.setCol3Rep.bind(this);
        this.handlecol3update = this.handlecol3update.bind(this);
    }

    state = {
        spa_col1: "/data/lines",
        spa_col2: "/data/lines?k=2&dist=LM&rep=mean",
        spa_col3: "/data/lines?k=2&dist=LM&rep=median",

        hm_col1: "/data/hm?wsize=5&step=3",
        hm_col2: "/data/hm?k=2&dist=LM&rep=mean",
        hm_col3: "/data/hm?k=2&dist=LM&rep=median",

        stat_col1: "/data/stat",
        stat_col2: "/data/stat?k=2&dist=LM&rep=mean",
        stat_col3: "/data/stat?k=2&dist=LM&rep=median",

        diff_col1: "/data/diff",
        diff_col2: "/data/diff?k=2&dist=LM&rep=mean",

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
        },
        kvals: [2, 3, 4, 5, 6, 7],
        dists: ["Euclidean", "Self-defined", "LM", "DM"],
        reps: ["Mean", "Median"],

        col1_wsize: 5,
        col1_step: 3,
        col1_bins: 10,

        col2_k: 2,
        col2_dist: "LM",
        col2_rep: "Mean",

        col3_k: 2,
        col3_dist: "LM",
        col3_rep: "Median",
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
                            url={this.state.spa_col1} />
                        </div>
                        <div key="SPA_COL2">
                            <MultipleLines width="1400" height="430" name="col2-mulline" 
                            url={this.state.spa_col2}/> 
                        </div>
                        <div key="SPA_COL3">
                            <MultipleLines width="1400" height="430" name="col3-mulline"
                            url={this.state.spa_col3}/>
                        </div>

                        <div key="HM_COL1">
                            <Navbar className="bg-light justify-content-between">
                                <Nav.Link eventKey="disabled" disabled>
                                    Dataset: energy
                                </Nav.Link>
                                <Form inline >
                                    <Form.Group controlId="wsize" onSubmit={this.handleHeatMap}>
                                        <Form.Label>Window size  </Form.Label>
                                        {/* <Form.Control type="number" min="1" placeholder={this.state.col1_wsize} 
                                        inputref={(ref) => {this.input = ref}}/> */}
                                    </Form.Group>

                                    <Form.Group controlId="step">
                                        <Form.Label>Step size</Form.Label>
                                        <Form.Control type="number" min="1" placeholder={this.state.col1_step} />
                                    </Form.Group>

                                    <Form.Group controlId="binno">
                                        <Form.Label>Number of bins</Form.Label>
                                        <Form.Control type="number" min="1" placeholder={this.state.col1_bins} />
                                    </Form.Group>
                                    <Button type="submit">Update</Button>
                                </Form>
                                
                            </Navbar>
                            <DiffHeatMap width="1400" height="430" name="col1-diffhm" 
                                url={this.state.hm_col1}/>
                        </div>
                        <div key="HM_COL2">
                        <Navbar className="bg-light justify-content-between">
                                
                                <Form inline onSubmit={this.handlecol2update} >
                                    <Form.Group controlId="col2k" >
                                        <Form.Label> k  </Form.Label>
                                        <Form.Control as="select" value={this.state.col2_k} onChange={this.setCol2K}>
                                            {this.state.kvals.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="col2dist">
                                        <Form.Label>Distance Metric</Form.Label>
                                        <Form.Control as="select" value={this.state.col2_dist} onChange={this.setCol2Dist}>
                                            {this.state.dists.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="col2rep">
                                        <Form.Label>Replace by</Form.Label>
                                        <Form.Control as="select" value={this.state.col2_rep} onChange={this.setCol2Rep}>
                                            {this.state.reps.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button type="submit">Load</Button>
                                </Form>
                                
                            </Navbar>
                            <DiffHeatMap width="1400" height="430" name="col2-diffhm" 
                            url={this.state.hm_col2}/>
                        </div>
                        <div key="HM_COL3">
                        <Navbar className="bg-light justify-content-between">
                                
                                <Form inline onSubmit={this.handlecol3update} >
                                    <Form.Group controlId="col3k" >
                                        <Form.Label> k  </Form.Label>
                                        <Form.Control as="select" value={this.state.col3_k} onChange={this.setCol3K}>
                                            {this.state.kvals.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="col3dist">
                                        <Form.Label>Distance Metric</Form.Label>
                                        <Form.Control as="select" value={this.state.col3_dist} onChange={this.setCol3Dist}>
                                            {this.state.dists.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="col3rep">
                                        <Form.Label>Replace by</Form.Label>
                                        <Form.Control as="select" value={this.state.col3_rep} onChange={this.setCol3Rep}>
                                            {this.state.reps.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button type="submit">Load</Button>
                                </Form>
                                
                            </Navbar>
                            <DiffHeatMap width="1400" height="430" name="col3-diffhm" 
                            url={this.state.hm_col3}/>
                        </div>

                        {/* <div key="SCA1_COL1">
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
                        </div>  */}

                        {/* <div key="SCA2_COL1">
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
                        </div> */}
                        
                        
                        
                        
                </Grid>
                
            </React.Fragment>
        )
    }

    handleHeatMap(event) {
        event.preventDefault();
        this.setState({
            hm_col1: "/data/hm?wsize="
        })
    }

    setwsize(event) {
        this.setState({col1_wsize: event.target.value});
        console.log(this.input.value)
    }

    setCol2K(event) {
        this.setState({ col2_k: event.target.value });
    }
    setCol2Dist(event) {
        this.setState({ col2_dist: event.target.value });
    }
    setCol2Rep(event) {
        this.setState({ col2_rep: event.target.value });
    }
    handlecol2update(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            spa_col2: "/data/lines?k=" + this.state.col2_k + "&dist=" + this.state.col2_dist + "&rep=" + this.state.col2_rep,
            hm_col2: "/data/hm?k=" + this.state.col2_k + "&dist=" + this.state.col2_dist + "&rep=" + this.state.col2_rep,
            stat_col2: "/data/stat?k=" + this.state.col2_k + "&dist=" + this.state.col2_dist + "&rep=" + this.state.col2_rep,
            diff_col2: "/data/diff?k=" + this.state.col2_k + "&dist=" + this.state.col2_dist + "&rep=" + this.state.col2_rep
        })
    }

    setCol3K(event) {
        this.setState({ col3_k: event.target.value });
    }
    setCol3Dist(event) {
        this.setState({ col3_dist: event.target.value });
    }
    setCol3Rep(event) {
        this.setState({ col3_rep: event.target.value });
    }
    handlecol3update(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            spa_col3: "/data/lines?k=" + this.state.col3_k + "&dist=" + this.state.col3_dist + "&rep=" + this.state.col3_rep,
            hm_col3: "/data/hm?k=" + this.state.col3_k + "&dist=" + this.state.col3_dist + "&rep=" + this.state.col3_rep,
            stat_col3: "/data/stat?k=" + this.state.col3_k + "&dist=" + this.state.col3_dist + "&rep=" + this.state.col3_rep,
            diff_col3: "/data/diff?k=" + this.state.col3_k + "&dist=" + this.state.col3_dist + "&rep=" + this.state.col3_rep
        })
    }
}

export default Dashboard1;