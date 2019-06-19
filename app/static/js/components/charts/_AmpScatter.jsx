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

    setToolTip = (max, min, x, y, id) => {
        this.setState({
            tooltip: max ? {max, min, x, y, id} : null
        })
    }

    tooltipProps = () => {
        const {max, min, x, y, id} = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: `max: ${Math.round(max * 100) / 100}, min: ${Math.round(min * 100) / 100}, id: ${id}`,
                style: {top: y-40, left: x-40}
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
        if(this.props.initData !== prevProps.initData) {
            this.renderD3('load')
        }
        if(this.props.indexes !== prevProps.indexes) {
            this.renderD3('update')
        }
        if(this.props.hover !== prevProps.hover) {
            if(this.props.hover) {
                let id = this.props.hover[0];
                let node = d3.select(`.${this.props.name}.data-${id}`)
                if(!node.empty()) {
                    this.setToolTip(node.attr('max'), node.attr('min'), node.attr('cx'), node.attr('cy'), id);
                }
            } else {
                this.setToolTip(null);
            }
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
            name,
            initData,
            indexes,
            time,
            setHover,
            isFreeze,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        const render = mode === 'render'
        const update = mode === 'update'
        const load = mode === 'load'

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
            data = initData;
        } else if(update) {
            if(indexes) {
                data = initData.filter(d =>  indexes.includes(d.index) && (d.time === time))
            } 
            svg = d3.select(faux).select('svg').select('g');
        } else if(load) {
            data = initData;
            svg = d3.select(faux).select('svg').select('g');
        }

        let xScale, yScale;
        xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.min})).nice()
            .range([0, chartWidth]);

        yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {return d.max})).nice()
            .range([chartHeight, 0])
        
        
        if(update) {
            let dots = svg.selectAll('.dot')
                    .data(data);
        
            dots.exit().transition().attr('r', 0).remove();

            dots = dots
                    .enter()
                    .append("circle")
                    .on('mouseover', d => {
                        setHover([d.index]);
                    })
                    // .on('mouseout', d => {
                    //     console.log(isFreeze)
                    //     if(!isFreeze) setHover(null);
                    // })
                    .on('click', d => {
                        setHover([d.index]);
                    })
                    .merge(dots);
            
            dots
                .attr('r', 7.5)
                .attr("cx", function (d) { return xScale(d.min); } )
                .attr("cy", function (d) { return yScale(d.max); } )
                .attr("max", d => d.max)
                .attr("min", d => d.min)
                .transition()
                .attr("class", d => `${name} dot data data-${d.index}`);

            
        } else if(load) {
            let dots = svg.selectAll('.dot')
                    .data([]);
        
            dots.exit().transition().attr('r', 0).remove();
        }
        animateFauxDOM(1000);
        
        const xAxis = d3.axisBottom(xScale).ticks(5)
        const yAxis = d3.axisLeft(yScale).ticks(10)
        if(render) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis)

            svg.append('g').attr('class', 'y axis').call(yAxis);

            svg.append("text")
                .attr('transform', `translate(${chartWidth - 10}, ${chartHeight - 5})`)
                .attr('class', 'axis label')
                .style('text-anchor', 'middle')
                .text("min")
                    .style("font-size", 14);
            svg.append("text")
                .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)
                .attr('class', 'axis label')
                .style('text-anchor', 'middle')
                .text("max")
                    .style("font-size", 14);
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

export default withFauxDOM(AmpScatter);