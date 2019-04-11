import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import styled from 'styled-components';
// import withD3Renderer from '../../hocs/withD3Renderer';

// import Tooltip from './Tooltip';


const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

class Scatter extends Component {
    
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    componentDidMount() {
        // this.renderD3();
    }

    render() {
        return (
            <Wrapper className="scatterplot" >
                {this.props.chart}
                
            </Wrapper>
        )
    }

    renderD3 () {
        const {
            defaultData
        } = this.props;

        const data = this.props.defaultData;
        console.log(data)
        const faux = this.props.connectFauxDOM('div', 'chart')
        

        const margin = {top: 10, right: 20, bottom: 10, left: 20},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        const svg = d3.select(faux).append('svg');

        // d3.json("/json/scatter_origin").then(function(data) {

        svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d=> {return d.mean}))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d=> {return d.std}))
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg
            .append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.mean); } )
                .attr("cy", function (d) { return y(d.std); } )
                .attr("r", 5)
                .style("fill", "#E7A72C")
            .append("text")
                .text(function(d) {
                    return d.std + ',' + d.mean;
                });
        // })
    }
    
}

Scatter.defaultProps = {
    chart: 'loading'
}

// ScatterPlot.propTypes = {
//     title: PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
// };

// const FauxScatter = withFauxDOM(ScatterPlot);
// export default withFauxDOM(withD3Renderer(ScatterPlot));
export default withFauxDOM(Scatter);