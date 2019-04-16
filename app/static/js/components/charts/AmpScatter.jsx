import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import styled from 'styled-components';

import Tooltip from './Tooltip';

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`

class AmpScatter extends Component {
    
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        tooltip: null
    }

    setToolTip = (mean, std, x, y) => {
        this.setState(state => ({
            tooltip: mean ? {mean, std, x, y} : null
        }))
    }

    tooltipProps = () => {
        const {mean, std, x, y} = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: `mean: ${Math.round(mean * 100) / 100}, std: ${Math.round(std * 100) / 100}`,
                style: {top: y + 10, left: x - 10}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }

    componentDidMount() {
        this.renderD3('render')
    }

    componentDidUpdate(prevProps) {
        if(this.props.indexes !== prevProps.indexes) {
            this.renderD3('update')
        }
        
    }

    render() {
        return (
            <Wrapper className="scatterplot">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </Wrapper>
        )
    }

    renderD3 (mode) {
        const {
            width,
            height,
            initData,
            indexes,
            time,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        const render = mode === 'render'
        const update = mode === 'update'
        
        const margin = {top: 20, right: 20, bottom: 20, left: 35};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        

        let faux = connectFauxDOM('div', 'chart')
        let svg, data;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
            data = initData.filter(d =>  [0, 10, 20,30, 40].includes(d.index) && d.time === 0);
        } else if(update) {
            if(indexes && time) {
                data = initData.filter(d =>  indexes.includes(d.index) && (d.time === time))
            } 
            svg = d3.select(faux).select('svg').select('g');
        }  

        let xScale, yScale;
        xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.min})).nice()
            .rangeRound([0, chartWidth]);
        yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.max})).nice()
            .rangeRound([chartHeight, 0])
        
        const xAxis = d3.axisBottom(xScale).tickSize(0)
        const yAxis = d3.axisLeft(yScale).tickSize(0)

        let dotColor;
        if(data.length >= 10) {
            dotColor = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, d3.max(data, d => {return d.max})]);
        } else {
            dotColor = d3.scaleOrdinal(d3.schemeCategory10);
        }

        let dots = svg.selectAll('.dot')
                    .data(data);
        
        dots.exit().transition().attr('r', 0).remove();
        dots = dots
                .enter()
                .append("circle")
                .attr('class', d => `dot stroked-negative data data-${d.index}`)
                .attr("r", 4)
                .attr("cx", function (d) { return xScale(d.min); } )
                .attr("cy", function (d) { return yScale(d.max); } )
                .style("fill", d => {return dotColor(d.std)})
                .on('mouseover', d => {
                    this.setToolTip(d.min, d.max, xScale(d.min), yScale(d.max));
                })
                .on('mouseout', d => {
                    this.setToolTip(null);
                })
                .merge(dots);
        
        dots
            .transition()
            .attr('r', 4)
            .attr("cx", function (d) { return xScale(d.min); } )
            .attr("cy", function (d) { return yScale(d.max); } )
            .style("fill", d => {return dotColor(d.max)});

        animateFauxDOM(800);

        if(render) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis)
                .append('text')
                .attr('class', 'label')
                .attr('x', chartWidth / 2)
                .attr('y', 35)
                .style('text-anchor', 'middle')
                .text("mean and std");

            svg.append('g').attr('class', 'y axis').call(yAxis);
        } else if(update) {
            svg.select('g.x.axis').call(xAxis)
            svg.select('g.y.axis').call(yAxis)
        }
    }
    
}

AmpScatter.defaultProps = {
    chart: 'loading'
}

// ScatterPlot.propTypes = {
//     title: PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
// };

export default withFauxDOM(AmpScatter)