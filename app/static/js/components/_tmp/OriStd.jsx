import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import styled from 'styled-components';



class OriStd extends Component {
    
    constructor() {
        super();
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        tooltip: null
    }
    
    componentDidMount() {
        this.renderD3();
    }

    setTooltip = (data) => {
        // this.setState({tooltip: state});
        this.setState(state => ({tooltip: data ? data : null}));
        console.log(this.state.tooltip)
    }

    tooltipProps() {
        const {data, pos} = this.state.tooltip;
        return {
            style: {top: pos[0], left: pos[1]},
            content: data
        }
    }

    render() {
        return (
            <div className="scatterplot" >
                {this.props.chart}
            </div>
        )
    }

    renderD3 () {
        // const data = this.props.data;
        const faux = this.props.connectFauxDOM('div', 'chart')


        const margin = {top: 10, right: 20, bottom: 10, left: 20},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        const svg = d3.select(faux).append('svg');

        d3.json("/json/stat_ori").then(function(data) {

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
            // console.log(d3.min(data, d=>{return d.std}))
        const y = d3.scaleLinear()
            .domain(d3.extent(data, d=> {return d.std}))
            .domain([d3.min(data, d=>{return d.std})-5,d3.max(data, d=>{return d.std})+10])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.mean); } )
                .attr("cy", function (d) { return y(d.std); } )
                .attr("r", 3)
                .style("fill", "#E7A72C")
            .on('mouseover', d => {
                    // console.log(d);
                this.setTooltip(d);
            })
            .on('mouseout', d => {

            })
            .on('click', d=>{
                // alert(d)
            });


        
        })
    }
    mousemove(){
        console.log("Test")
    }
}

OriStd.defaultProps = {
    chart: 'loading'
}

// ScatterPlot.propTypes = {
//     title: PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
// };

// const FauxScatter = withFauxDOM(ScatterPlot);
// export default withFauxDOM(withD3Renderer(ScatterPlot));
export default withFauxDOM(OriStd);