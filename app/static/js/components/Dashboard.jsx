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
import S2StatScatter from '../containers/S2StatScatter';
import S2AmpScatter from '../containers/S2AmpScatter';
import S2Spaghetti from '../containers/S2Spaghetti';
import { event } from 'd3-selection';

const GridLayout = WidthProvider(ReactGridLayout)


const withSizeHOC = withSize();
const SizedOriHeatMap = withSizeHOC(OriHeatMap);
const SizedOriStaScatter = withSizeHOC(OriStatScatter);
const SizedOriAmpScatter = withSizeHOC(OriAmpScatter);
const SizedSpaghetti = withSizeHOC(OriSpaghetti);
const SizedCol2HeatMap = withSizeHOC(Col2HeatMap);
const SizedS2StaScatter = withSizeHOC(S2StatScatter);
const SizedS2AmpScatter = withSizeHOC(S2AmpScatter);
const SizedS2Spaghetti = withSizeHOC(S2Spaghetti);

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
    min-width: 2800px;
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        kvals: [2, 3, 4, 5, 6, 7],
        dists: ["Euclidean", "Self-defined", "LM", "DM"],
        reps: ["Mean", "Median"],
        k: 2,
        dist: "Euclidean",
        rep: "Mean",
        updateData: null
    }

    handleSubmit(event) {
        
        fetch('/json/hm?k=' + this.state.k +'&rep=' + this.state.rep + "&dist=" + this.state.dist)
            .then(res => res.json())
            .then(data => {
                this.setState({updateData: data})
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

            {i: 'HM_PAD', x: 7, y: 0, w: 6, h: 4, static:true},
            {i: 'SCA1_PAD', x: 7, y: 9, w: 2, h: 4, static:true},
            {i: 'SCA2_PAD', x: 9, y: 9, w: 2, h: 4, static:true},
            {i: 'SPA_PAD', x: 7, y: 4, w: 6, h: 4, static:true},
        ];

        return (
            <React.Fragment>
                <Grid 
                    className="dashboard" 
                    layout={layout} 
                    cols={12} 
                    rowHeight={100}
                    hover={hover} 
                    class="box"
                    {...this.props}>
                     {/* <Box key="HM_ORI"> 
                     <Nav className="justify-content-center"  defaultActiveKey="/home" as="ul">
                            <Nav.Link eventKey="disabled" disabled>
                                Dataset: energy
                            </Nav.Link>
                            <Nav.Item as="li">
                                <Form>
                                    <Row>
                                        <Col>
                                            <Form.Control placeholder="First name" />
                                        </Col>
                                        <Col>
                                            <Form.Control placeholder="Last name" />
                                        </Col>

                                    </Row>
                                </Form>
                            </Nav.Item>
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
                    </Box>  */}
                    

                    <Box key="HM_PAD">
                    <Navbar className="bg-light justify-content-between">
                        <Form inline onSubmit={this.handleSubmit}>
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
                    </Navbar>
                        {/* {this.state.updateData ? console.log(this.state.updateData['hm']): null} */}
                        <SizedCol2HeatMap update={this.state.updateData ? this.state.updateData["hm"]: null} /> 
                    </Box>
                    <Box key="SCA1_PAD">
                        <SizedS2StaScatter />
                    </Box>
                    <Box key="SCA2_PAD">
                        <SizedS2AmpScatter />
                    </Box>
                    <Box key="SPA_PAD">
                        <SizedS2Spaghetti />
                    </Box>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Dashboard;