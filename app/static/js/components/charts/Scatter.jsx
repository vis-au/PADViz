import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';


class Scatter extends Component {
    
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }
    
    componentDidMount() {
        this.renderD3()
    }

    componentDidUpdate(prevProps) {
        if(this.props.pos !== prevProps.pos) {
            console.log('change')
        }
    }

    render() {
        return (
            <div className="scatterplot">
                {this.props.chart}
            </div>
        )
    }

    renderD3 () {
        const {
            width,
            height,
            initData,
            chartType,
            connectFauxDOM
        } = this.props;
        
        const margin = {top: 20, right: 20, bottom: 20, left: 20};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart')
        // Initialize
        const svg = d3.select(faux).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const dotColor = d3.scaleOrdinal(d3.schemeCategory10);
        
        let xMax, yMax;
        if(chartType === "stat") {
            xMax = d3.max(initData, d=> {return d.mean});
            yMax = d3.max(initData, d=>{return d.std});
        } else if (chartType === "amp") {
            xMax = d3.max(initData, d=> {return d.min});
            yMax = d3.max(initData, d=>{return d.max});
        }
        
        const x = d3.scaleLinear()
            .domain([0, xMax]).nice()
            .range([0, chartWidth]);
        svg.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(x).tickSize(0));

        const y = d3.scaleLinear()
            .domain([0, yMax]).nice()
            .range([ chartHeight, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg
            .append('g')
            .selectAll("dot")
            .data(initData)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.mean); } )
                .attr("cy", function (d) { return y(d.std); } )
                .attr("r", 5)
                .style("fill", d => {return dotColor(d.index)})
            .append("text")
                .text(function(d) {
                    return d.std + ',' + d.mean;
                });

    }
    
}

Scatter.defaultProps = {
    chart: 'loading'
}

// ScatterPlot.propTypes = {
//     title: PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
// };

export default withFauxDOM(Scatter)