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

    setToolTip = (max, min, x, y) => {
        this.setState(state => ({
            tooltip: max ? {max, min, x, y} : null
        }))
    }

    tooltipProps = () => {
        const {max, min, x, y} = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: `max: ${Math.round(max * 100) / 100}, min: ${Math.round(min * 100) / 100}`,
                style: {top: y - 20, left: x - 20}
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
        // if(this.props.hover !== prevProps.hover) {
        //     this.renderD3('hover')
        // }
        
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
            setHover,
            connectFauxDOM,
            animateFauxDOM,
            hover
        } = this.props;
        
        const render = mode === 'render'
        const update = mode === 'update'
        const hoverUpdate = mode === 'hover'
        
        const margin = {top: 20, right: 20, bottom: 40, left: 40};
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
        } else if(hoverUpdate) {
            svg = d3.select(faux).select('svg').select('g');
        }

        let xScale, yScale;
        xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.min})).nice()
            .range([0, chartWidth]);
        yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.max})).nice()
            .range([chartHeight, 0])
        
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
                .attr('class', d => `amp dot stroked-negative data data-${d.index}`)
                .attr("r", 4)
                .attr("cx", function (d) { return xScale(d.min); } )
                .attr("cy", function (d) { return yScale(d.max); } )
                .on('mouseover', d => {
                    d3.select(`.amp.data-${d.index}`).attr('r', 10).attr("fill", "#005073");
                    this.setToolTip(d.min, d.max, xScale(d.min), yScale(d.max));
                    setHover([d.index]);
                })
                .on('mouseout', d => {
                    d3.select(`.amp.data-${d.index}`).attr('r', 4).attr("fill", "#666666");
                    this.setToolTip(null);
                    setHover(null);
                })
                .merge(dots);
        
        dots
            .transition()
            .attr('r', 4)
            .attr("cx", function (d) { return xScale(d.min); } )
            .attr("cy", function (d) { return yScale(d.max); } )
            .attr("fill", "#666666");

        animateFauxDOM(800);
        
        if(render) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis)

            svg.append('g').attr('class', 'y axis').call(yAxis);
        } else if(update) {
            svg.select('g.x.axis').call(xAxis)
            svg.select('g.y.axis').call(yAxis)
        }

        svg.append("text")
            .attr('transform', `translate(${chartWidth - 10}, ${chartHeight - 5})`)
            .attr('class', 'label')
            .style('text-anchor', 'middle')
            .text("min");
        svg.append("text")
            .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)
            .attr('class', 'label')
            .style('text-anchor', 'middle')
            .text("max");
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