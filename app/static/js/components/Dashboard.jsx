import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { withSize } from 'react-sizeme'
import { Row, Col, Form, Navbar, Nav, InputGroup, FormControl, Button, NavDropdown, NavItem} from 'react-bootstrap';

import OriHeatMap from '../containers/OriHeatMap';
import OriStatScatter from '../containers/OriStatScatter';
import OriAmpScatter from '../containers/OriAmpScatter';
import OriSpaghetti from '../containers/OriSpaghetti';
import Col2HeatMap from '../containers/Col2HeatMap';
import Col2StatScatter from '../containers/Col2StatScatter';
import Col2AmpScatter from '../containers/Col2AmpScatter';
import Col2Spaghetti from '../containers/Col2Spaghetti';
import Col3HeatMap from '../containers/Col3HeatMap';
import Col3StatScatter from '../containers/Col3StatScatter';
import Col3AmpScatter from '../containers/Col3AmpScatter';
import Col3Spaghetti from '../containers/Col3Spaghetti';

const GridLayout = WidthProvider(ReactGridLayout)


const withSizeHOC = withSize();
const SizedOriHeatMap = withSizeHOC(OriHeatMap);
const SizedOriStaScatter = withSizeHOC(OriStatScatter);
const SizedOriAmpScatter = withSizeHOC(OriAmpScatter);
const SizedSpaghetti = withSizeHOC(OriSpaghetti);
const SizedCol2HeatMap = withSizeHOC(Col2HeatMap);
const SizedCol2StaScatter = withSizeHOC(Col2StatScatter);
const SizedCol2AmpScatter = withSizeHOC(Col2AmpScatter);
const SizedCol2Spaghetti = withSizeHOC(Col2Spaghetti);
const SizedCol3HeatMap = withSizeHOC(Col3HeatMap);
const SizedCol3StaScatter = withSizeHOC(Col3StatScatter);
const SizedCol3AmpScatter = withSizeHOC(Col3AmpScatter);
const SizedCol3Spaghetti = withSizeHOC(Col3Spaghetti);

const Box = styled.div`
    box-sizing: content-box;
    width: 100%;
    border: solid orange 3px;
`;

const generateHoverCss = index => `
    .dot.data-${index} {
        opacity: 1;
        -webkit-transition: opacity .2s ease-in; 
        fill: #7bd666;
        r: 10;
    }
    .line.data-${index} {
        opacity: 1;
        -webkit-transition: opacity .2s ease-in; 
        stroke: #7bd666;
        stroke-width: 5;
    }
`;

const Grid = styled(GridLayout)`
    min-width: 4200px;
    .line {
        
    }
    .dot .selected {
        stroke: red;
        stroke-width: 2px;
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
      }
`;


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.setRep = this.setRep.bind(this);
        this.setK = this.setK.bind(this);
        this.setDist = this.setDist.bind(this);
        this.handleSubmitCol1 = this.handleSubmitCol1.bind(this);
        this.handleSubmitCol2 = this.handleSubmitCol2.bind(this);
    }

    state = {
        kvals: [2, 3, 4, 5, 6, 7],
        dists: ["Euclidean", "Self-defined", "LM", "DM"],
        reps: ["Mean", "Median"],
        k: 2,
        dist: "Euclidean",
        rep: "Mean",
        updateCol1: null,
        updateCol2: null,
        k2: 6,
        dist2: "Euclidean",
        rep2: "Mean",
    }

    handleSubmitCol1(event) {
        
        fetch('/json/hm?k=' + this.state.k +'&rep=' + this.state.rep + "&dist=" + this.state.dist)
            .then(res => res.json())
            .then(data => {
                this.setState({updateCol1: data})
            });
    }

    handleSubmitCol2(event) {
        
        fetch('/json/hm?k=' + this.state.k +'&rep=' + this.state.rep + "&dist=" + this.state.dist)
            .then(res => res.json())
            .then(data => {
                this.setState({updateCol2: data})
            });
    }

    setK(event) {
        this.setState({k: event.target.value})
    }

    setRep(event) {
        this.setState({rep: event.target.value})
    }

    setDist(event) {
        this.setState({dist: event.target.value})
    }

    setK2(event) {
        this.setState({k2: event.target.value})
    }

    setRep2(event) {
        this.setState({rep2: event.target.value})
    }

    setDist2(event) {
        this.setState({dist2: event.target.value})
    }

    render() {
        const { 
            hover,
            hmIdx
         } = this.props;

        const layout = [
            {i: 'HM_ORI', x: 0, y: 0, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1', x: 1, y: 9, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2', x: 3, y: 9, w: 2, h: 4, static:true},
            {i: 'SPA', x: 0, y: 4, w: 6, h: 4, static:true},

            {i: 'HM_COL1', x: 6, y: 0, w: 6, h: 4, static:true},
            {i: 'SCA1_COL1', x: 7, y: 9, w: 2, h: 4, static:true},
            {i: 'SCA2_COL1', x: 9, y: 9, w: 2, h: 4, static:true},
            {i: 'SPA_COL1', x: 6, y: 4, w: 6, h: 4, static:true},

            {i: 'HM_COL2', x: 12, y: 0, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1_COL2', x: 13, y: 9, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2_COL2', x: 15, y: 9, w: 2, h: 4, static:true},
            {i: 'SPA_COL2', x: 12, y: 4, w: 6, h: 4, static:true},
        ];

        return (
            <React.Fragment>
                <Grid 
                    className="dashboard" 
                    layout={layout} 
                    cols={18} 
                    rowHeight={100}
                    hover={hover} 
                    class="box"
                    {...this.props}>
                     <Box key="HM_ORI"> 
                     <Nav className="justify-content-center"  defaultActiveKey="/home" as="ul">
                            <Nav.Link eventKey="disabled" disabled>
                                Dataset: energy
                            </Nav.Link>
                            <Nav.Link eventKey="disabled" disabled>
                                window size: 5
                            </Nav.Link>
                            <Nav.Link eventKey="disabled" disabled>
                                step size: 3
                            </Nav.Link>
                        </Nav>
                        <SizedOriHeatMap />
                    </Box> 
                    <Box key="SPA">
                        <SizedSpaghetti />
                    </Box>
                    <Box key="SCA1">
                        <SizedOriStaScatter />
                    </Box>
                    <Box key="SCA2">
                        <SizedOriAmpScatter />
                    </Box> 
                    

                    <Box key="HM_COL1">
                    <Navbar className="bg-light justify-content-between">
                        <Form inline onSubmit={this.handleSubmitCol1}>
                        <label>
                            Replace by: 
                            <select value={this.state.rep} onChange={ this.setRep}>
                                {this.state.reps.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label>
                            k: 
                            <select value={this.state.k} onChange={ this.setK}>
                                {this.state.kvals.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label>
                            distance metric:
                            <select value={this.state.dist} onChange={ this.setDist}>
                                {this.state.dists.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                            <Button type="submit">Load</Button>
                        </Form>
                        <Nav.Link eventKey="disabled" disabled>
                                k: {this.state.k}
                        </Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                                replace by: {this.state.rep}
                        </Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                                distance metric: {this.state.dist}
                        </Nav.Link>
                    </Navbar>
                        <SizedCol2HeatMap update={this.state.updateCol1 ? this.state.updateCol1["hm"]: null} /> 
                    </Box>
                    <Box key="SPA_COL1">
                        <SizedCol2Spaghetti update={this.state.updateCol1 ? this.state.updateCol1["line"]: null}/>
                    </Box>
                    <Box key="SCA1_COL1">
                        <SizedCol2StaScatter update={this.state.updateCol1 ? this.state.updateCol1["stat"]: null}/>
                    </Box>
                    <Box key="SCA2_COL1">
                        <SizedCol2AmpScatter update={this.state.updateCol1 ? this.state.updateCol1["maxmin"]: null}/>
                    </Box>


                    <Box key="HM_COL2">
                    <Navbar className="bg-light justify-content-between">
                        <Form inline onSubmit={this.handleSubmitCol2}>
                        <label>
                            Replace by: 
                            <select value={this.state.rep2} onChange={ this.setRep2}>
                                {this.state.reps.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label>
                            k: 
                            <select value={this.state.k2} onChange={ this.setK2}>
                                {this.state.kvals.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label>
                            distance metric:
                            <select value={this.state.dist2} onChange={ this.setDist2}>
                                {this.state.dists.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </label>

                            <Button type="submit">Load</Button>
                        </Form>
                        <Nav.Link eventKey="disabled" disabled>
                                k: {this.state.k2}
                        </Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                                replace by: {this.state.rep2}
                        </Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                                distance metric: {this.state.dist2}
                        </Nav.Link>
                    </Navbar>
                        <SizedCol3HeatMap update={this.state.updateCol2 ? this.state.updateCol2["hm"]: null} /> 
                    </Box>
                    <Box key="SPA_COL2">
                        <SizedCol3Spaghetti update={this.state.updateCol2 ? this.state.updateCol2["line"]: null}/>
                    </Box>
                    <Box key="SCA1_COL2">
                        <SizedCol3StaScatter update={this.state.updateCol2 ? this.state.updateCol2["stat"]: null}/>
                    </Box>
                    <Box key="SCA2_COL2">
                        <SizedCol3AmpScatter update={this.state.updateCol2 ? this.state.updateCol2["maxmin"]: null}/>
                    </Box>
                    
                </Grid>
            </React.Fragment>
        )
    }
}

export default Dashboard;