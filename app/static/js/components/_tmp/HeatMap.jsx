import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`

class HeatMap extends Component {

    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
        // console.log(this.props)
    }

    componentDidMount() {
        this.renderD3();
    }

    render() {
        return (
            <Wrapper className="heatmap">
                {this.props.chart}
            </Wrapper>
        )
    }

    renderD3 () {
        const faux = this.props.connectFauxDOM('div', 'chart');

        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const graphWidth = 1400-margin.left-margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(faux).append('svg');

        d3.json("json/heatmap").then(function(data){
            svg
            .attr("width", graphWidth)
            .attr("height", height)
            .append("g")
                .attr('transform', `translate(${margin.left}, ${margin.top})`)

            const t_interval = d3.map(data, function(d){return d.time;}).keys();
            const amp_range = d3.map(data, function(d){return d.amp_interval;}).keys();
            
            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([ 0, graphWidth])
                .domain(t_interval)
                .padding(0.001);

            svg.append("g")
                .style("font-size", 10)
                .attr("transform", "translate(0," + (height-55) + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .select(".domain").remove();
            
            // Build Y scales and axis:
            const y = d3.scaleBand()
                .range([ height-55, 0 ])
                .domain(amp_range)
                .padding(0.01);

            svg.append("g")
                .style("font-size", 15)
                .call(d3.axisLeft(y))
                .select(".domain").remove();
            
            const scale = d3.scaleThreshold()
            .range(['#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'])
            .domain([1, 2, 4, 8, 16, 32, 64, 128, 256, 512]);
            
            svg.selectAll()
                .data(data, function(d) {return d.time+':'+d.amp_interval;})
                .enter()
                .append("rect")
                    .attr("x", function(d) { return x(d.time) })
                    .attr("y", function(d) { return y(d.amp_interval) })
                    .attr("width", x.bandwidth() )
                    .attr("height", y.bandwidth() )
                    .attr("value", d=>d.count)
                    .style("fill", function(d) {
                        if(d.count == 0) {
                            return d3.rgb("#F8F7F7");
                        } else {
                            return scale(d.count);
                        }
                    })
                    .style("stroke-width", 4)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                    .on('mouseover', d => {
                        console.log(d)
                    })
                    .on('mouseout', d => {

                    })
                    .on('click', d=>{
                        console.log(d)
                    });

        });
    }
}

HeatMap.defaultProps = {
    chart: 'loading'
};

export default withFauxDOM(HeatMap);