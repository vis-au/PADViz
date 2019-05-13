import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReactGridLayout,{ WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { withSize } from 'react-sizeme'
import { Row, Col, Form, Navbar, Nav, InputGroup, FormControl, Button, NavDropdown, NavItem} from 'react-bootstrap';

import AmpHeatMap from '../containers/AmpHeatMap';
import MinMaxScatter from '../containers/MinMaxScatter';
import MeanStdScatter from '../containers/MeanStdScatter';
import MultiLines from '../containers/MultiLines';



const GridLayout = WidthProvider(ReactGridLayout)


const withSizeHOC = withSize();
const SizedAmpHeatMap = withSizeHOC(AmpHeatMap);
const SizedMinMaxScatter = withSizeHOC(MinMaxScatter);
const SizedMeanStdScatter = withSizeHOC(MeanStdScatter);
const SizedMultiLines = withSizeHOC(MultiLines);

const Box = styled.div`
    box-sizing: content-box;
    width: 100%;
    // border: solid orange 3px;
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
        this.setRep2 = this.setRep2.bind(this);
        this.setK2 = this.setK2.bind(this);
        this.setDist2 = this.setDist2.bind(this);
        this.handleSubmitCol1 = this.handleSubmitCol1.bind(this);
        this.handleSubmitCol2 = this.handleSubmitCol2.bind(this);
        // this.clickHandler = this.clickHandler.bind(this);
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
        event.preventDefault();
        fetch('/json/hm?k=' + this.state.k +'&rep=' + this.state.rep + "&dist=" + this.state.dist)
            .then(res => res.json())
            .then(data => {
                this.setState({updateCol1: data})
            });
    }

    handleSubmitCol2(event) {
        event.preventDefault();
        fetch('/json/hm?k=' + this.state.k2 +'&rep=' + this.state.rep2 + "&dist=" + this.state.dist2)
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
        console.log(this.state.rep2)
    }

    setDist2(event) {
        this.setState({dist2: event.target.value})
    }

    // componentDidMount() {
    //     document.body.addEventListener('onDoubleClick', this.clickHandler);
    //     // document.body.addEventListener('click', this.clickHandler);
    // }

    // clickHandler() {
    //     alert("double click")
    //     this.props.setFreeze(!this.props.isFreeze);
    //     // console.log(this.props.isFreeze)
    // }

    render() {
        const { 
            hover
         } = this.props;

        const layout = [
            {i: 'HM_ORI', x: 0, y: 0, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1', x: 1, y: 8, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2', x: 3, y: 8, w: 2, h: 4, static:true},
            {i: 'SPA', x: 0, y: 4, w: 6, h: 4, static:true},

            {i: 'HM_COL1', x: 6, y: 0, w: 6, h: 4, static:true},
            {i: 'SCA1_COL1', x: 7, y: 8, w: 2, h: 4, static:true},
            {i: 'SCA2_COL1', x: 9, y: 8, w: 2, h: 4, static:true},
            {i: 'SPA_COL1', x: 6, y: 4, w: 6, h: 4, static:true},

            {i: 'HM_COL2', x: 12, y: 0, w: 6, h: 4, minW: 5, static:true},
            {i: 'SCA1_COL2', x: 13, y: 8, w: 2, h: 4, maxW: 4, static:true},
            {i: 'SCA2_COL2', x: 15, y: 8, w: 2, h: 4, static:true},
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
                        <SizedAmpHeatMap name="hm-col1" initUrl="/json/heatmap"/>
                    </Box> 
                    <Box key="SPA">
                        <SizedMultiLines name="spa-col1" initUrl="/json/line"/>
                    </Box>
                    <Box key="SCA1">
                        <SizedMeanStdScatter name="stascatter-col1" initUrl="/json/stat"/>
                    </Box>
                    <Box key="SCA2">
                        <SizedMinMaxScatter name="ampscatter-col1" initUrl="/json/amp"/>
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
                        <SizedAmpHeatMap name="hm-col2" initUrl="/json/heatmap?type=s2" update={this.state.updateCol1 ? this.state.updateCol1["hm"]: null}/>
                    </Box>
                    <Box key="SPA_COL1">
                        <SizedMultiLines name="spa-col2" initUrl="/json/line?type=s2" update={this.state.updateCol1 ? this.state.updateCol1["line"]: null}/>
                    </Box>
                    <Box key="SCA1_COL1">
                        <SizedMeanStdScatter name="stascatter-col2" initUrl="/json/stat?type=s2" update={this.state.updateCol1 ? this.state.updateCol1["stat"]: null}/>
                    </Box>
                    <Box key="SCA2_COL1">
                        <SizedMinMaxScatter name="ampscatter-col2" initUrl="/json/amp?type=s2" update={this.state.updateCol1 ? this.state.updateCol1["maxmin"]: null}/>
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
                        <SizedAmpHeatMap name="hm-col3" initUrl="/json/heatmap?type=s6" update={this.state.updateCol2 ? this.state.updateCol2["hm"]: null}/>
                    </Box>
                    <Box key="SPA_COL2">
                        <SizedMultiLines name="spa-col3" initUrl="/json/line?type=s6" update={this.state.updateCol2 ? this.state.updateCol2["line"]: null}/>
                    </Box>
                    <Box key="SCA1_COL2">
                        <SizedMeanStdScatter name="stascatter-col3" initUrl="/json/stat?type=s6" update={this.state.updateCol2 ? this.state.updateCol2["stat"]: null}/>
                    </Box>
                    <Box key="SCA2_COL2">
                        <MinMaxScatter name="ampscatter-col3" initUrl="/json/amp?type=s6" update={this.state.updateCol2 ? this.state.updateCol2["maxmin"]: null}/>
                    </Box>
                    
                </Grid>
            </React.Fragment>
        )
    }
}

export default Dashboard;