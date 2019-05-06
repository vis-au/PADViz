import React, { Component } from 'react';
import { Row, Col, Form, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import styled from 'styled-components';

import OriHeatMap from '../containers/OriHeatMap';
import OriStatScatter from '../containers/OriStatScatter';
import OriAmpScatter from '../containers/OriAmpScatter';
import OriSpaghetti from '../containers/OriSpaghetti';
import S2HeatMap from '../containers/S2HeatMap';
import S2StatScatter from '../containers/S2StatScatter';
import S2AmpScatter from '../containers/S2AmpScatter';
import S2Spaghetti from '../containers/S2Spaghetti';

// CSS SECTION

export default class Dashboard extends Component {

    componentDidMount() {

    }


    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col> <div className="wrapper">
                    <div className="box">
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
                    </div>
                    <div className="box"> 
                        <OriHeatMap />
                    </div>
                    <div className="box"> 
                    </div>
                </div>
</Col>
                    <Col><div className="wrapper">
                    <div className="box">
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
                    </div>
                    <div className="box"> 
                        <S2HeatMap />
                    </div>
                </div>
                </Col>
                    <Col></Col>
                </Row>
               
                
            </React.Fragment>
            
        )
    }
}
