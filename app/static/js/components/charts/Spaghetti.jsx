import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'
import { withFauxDOM } from 'react-faux-dom';

class Spaghetti extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }
    
    componentDidMount() {
        this.renderD3()
    }

    render() {
        return (
            <div className="spaghetti">
                {this.props.chart}
            </div>
        )
    }

    renderD3() {
        const {
            width,
            height,
            initData,
            connectFauxDOM
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
        
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        color.domain(d3.keys(initData[0]).filter(function(key){
                return key != "time";
        }))

        const energies = color.domain().map(function(r){
            return {
                r_id: r,
                values: initData.map(function(d){
                    return {
                        time: d.time,
                        power: +d[r]
                    }
                })
            }
        });

        const x = d3.scaleLinear()
                .domain(d3.extent(energies[0].values, d=>d.time))
                .range([0, chartWidth])
        svg.append('g')
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(x).tickSize(0))
        
        const y = d3.scaleLinear()
            // .domain([0, d3.max(energies, d => d3.max(d.values, v=>{return v.power;}))]).nice()
            .domain([0, 220])
            .range([chartHeight, 0])
        svg.append('g')
            .call(d3.axisLeft(y).tickSize(0))
        
        const line = d3.line()
            // .curve(d3.curveCardinal)
            .x(d => x(d.time))
            .y(d => y(d.power));
        
        svg.append("g")
            // .attr("transform", "translate(0, -10)")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(energies)
                .join("path")
                .style("mix-blend-mode", "multiply")
                .style("stroke", d => {
                    return color(d.r_id)
                })
                .attr("r_id", d=>d.r_id)
                .attr("d", d => line(d.values));
    }
}

export default withFauxDOM(Spaghetti);