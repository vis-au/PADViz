import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'
import { withFauxDOM } from 'react-faux-dom';

import Tooltip from './Tooltip';

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }
    
    state = {
        tooltip: null
    }

    setToolTip = (count, x, y) => {
        this.setState(state => ({
            tooltip: (count > 0) ? {count, x, y} : null
        }))
    }

    tooltipProps = () => {
        const { count, x, y } = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: count,
                style: {top: y, left: x + 80}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }

    componentDidMount() {
        this.renderD3()
    }

    render() {
        return (
            <div className="heatmap">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </div>
        )
    }

    renderD3() {
        const {
            width,
            height,
            initData,
            connectFauxDOM,
            setIndexes,
            setHover,
            setTime
        } = this.props;
        
        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart')
        // Initialize
        const svg = d3.select(faux).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const t_interval = d3.map(initData, function(d){return d.time;}).keys();
        const amp_range = d3.map(initData, function(d){return d.amp_interval;}).keys();

        // Build X scales and axis:
        const xScale = d3.scaleBand()
            .range([ 0, chartWidth])
            .domain(t_interval)
            .padding(0.001);
        
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + (chartHeight-55) + ")")
            .call(d3.axisBottom(xScale).tickSize(0))
            .select(".domain").remove();
        
        // Build Y scales and axis:
        const yScale = d3.scaleBand()
            .range([ chartHeight-55, 0 ])
            .domain(amp_range)
            .padding(0.01);

        svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(yScale).tickSize(0))
            .select(".domain").remove();

        const colorHold = ['#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'];
        const colorLText = ['1', '2', '<4', '<8', '<16', '<32', '<64', '<128', '<256', '<512']
        
        const colorScale = d3.scaleThreshold()
            .range(colorHold)
            .domain([1, 2, 4, 8, 16, 32, 64, 128, 256, 512]);
        
        svg.selectAll()
            .data(initData, function(d) {return d.time+':'+d.amp_interval;})
            .enter()
            .append("rect")
                // .attr('class', d => {
                //     let dl = d.instances.map(i => `data-${i}`);
                //     return "rec data " + dl
                // })
                .attr("x", function(d) { return xScale(d.time) })
                .attr("y", function(d) { return yScale(d.amp_interval) })
                .attr("width", xScale.bandwidth() )
                .attr("height", yScale.bandwidth() )
                .attr("value", d=>d.count)
                .style("fill", function(d) {
                    if(d.count == 0) {
                        return d3.rgb("#F8F7F7");
                    } else {
                        return colorScale(d.count);
                    }
                })
                .style("stroke-width", 4)
                .style("stroke", "none")
                .on('mouseover', (d, i) => {
                    this.setToolTip(d.count, xScale(d.time), yScale(d.amp_interval));
                    setHover(d.instances)
                })
                .on('mouseout', d => {
                    this.setToolTip(null);
                    setHover(null);
                })
                .on('click', d=>{
                    setIndexes(d.instances);
                    setTime(d.time)
                })
    }

}

HeatMap.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

HeatMap.defaultProps = {
    chart: 'loading'
};

export default withFauxDOM(HeatMap);
