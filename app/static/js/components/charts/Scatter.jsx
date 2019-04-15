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
        // console.log("pos now: " + this.props.pos +"   pose before:  " + prevProps.pos)
        if(this.props.pos !== prevProps.pos) {
            this.renderD3('update')
        }
        
    }

    render() {
        return (
            <div className="scatterplot">
                {this.props.chart}
            </div>
        )
    }

    renderD3 (mode) {
        const {
            width,
            height,
            initData,
            chartType,
            pos,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        const margin = {top: 20, right: 20, bottom: 20, left: 20};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        

        let faux = connectFauxDOM('div', 'chart')
        let svg, data;
        if(mode === "update") {
            if(pos && chartType === "stat") {
                data = initData.filter(d =>  pos.includes(d.index))
            } else if(pos && chartType === "amp") {
                data = initData.filter(d =>  pos.includes(d.index))
            }
            svg = d3.select(faux).select('svg').select('g');
        } else {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
            data = initData;
        }

        let x, y;
        if(chartType === "stat") {
            x = d3.scaleLinear()
                .domain([0, d3.max(data, d=> {return d.mean})])
                .rangeRound([0, chartWidth]);
            y = d3.scaleLinear()
                .domain([0, d3.max(data, d=>{return d.std})])
                .rangeRound([chartHeight, 0])
        } else if (chartType === "amp") {
            x = d3.scaleLinear()
                .domain([0, d3.max(data, d=> {return d.max})])
                .rangeRound([0, chartWidth]);
            y = d3.scaleLinear()
                .domain([0, d3.max(data, d=>{return d.min})])
                .rangeRound([chartHeight, 0])
        }

        svg.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(x).tickSize(0));
        svg.append("g")
            .call(d3.axisLeft(y));

        const dotColor = d3.scaleOrdinal(d3.schemeCategory10);

        let dots = svg
                    .selectAll("dot")
                    .data(data);
        
        dots = dots
                .enter()
                .append("circle")
                .attr('class', d => `dot data-${d.index}`)
                .attr("cx", function (d) { return x(d.mean); } )
                .attr("cy", function (d) { return y(d.std); } )
                .attr("r", 0)
                .style("fill", d => {return dotColor(d.index)})
                .merge(dots);
        
        dots
            .transition()
            .attr('r', 4)
            .attr("cx", function (d) { return x(d.mean); } )
            .attr("cy", function (d) { return y(d.std); } );

        animateFauxDOM(800);
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