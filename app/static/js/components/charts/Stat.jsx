import React, { Component } from 'react';
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';

import Tooltip from './Tooltip';

class Stat extends Component {

    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        tooltip: null,
    }

    setToolTip = (mean, std, x, y, id) => {
        this.setState(state => ({
            tooltip: mean ? {mean, std, x, y, id} : null
        }))
    }

    tooltipProps = () => {
        const {mean, std, x, y, id} = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: `mean: ${Math.round(mean * 100) / 100}, std: ${Math.round(std * 100) / 100}, id: ${id}`,
                style: {top: y-40, left: x}
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
            <div className="scatterplot">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </div>
        )
    }

    renderD3() {
        const {
            width,
            height,
            data,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;

        const margin = {top: 20, right: 20, bottom: 40, left: 80};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        

        let faux = connectFauxDOM('div', 'chart');
        let svg = d3.select(faux).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        

        let xScale, yScale;
    
        xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d=> {return d.mean})]).nice()
            .range([0, chartWidth]);
        
        yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d=>{return d.std})]).nice()
            .range([chartHeight, 0])

            let dots = svg.selectAll('.dot')
            .data(data);

        dots.exit().transition().attr('r', 0).remove();

        dots = dots
            .enter()
            .append("circle")
            .on('mouseover', (d, i) => {
                this.setToolTip(d.mean, d.std, chartWidth, 50, i)
                d3.select(`.data-264`)
                // d3.select(`.data-${i}`)
                    .attr("r", 15)
                    .attr("opacity", 1)
                    .attr("fill","#18da3b")
            })
            .on('mouseout', (d, i) => {
                this.setToolTip(null)
                d3.select(`.data-${i}`)
                    .attr("r", 7.5)
                    .attr("opacity", 0.7)
                    .attr("fill","#000000")
                });
        dots
            .attr("r", 7.5)
            .attr("cx", function (d) { return xScale(d.mean); } )
            .attr("cy", function (d) { return yScale(d.std); } )
            .attr("mean", d => d.mean)
            .attr("std", d => d.std)
            .attr("class", d => `${name} dot data data-${d.index}`)
            .attr("opacity", 0.7)
            .transition();
        
        let xAxis = d3.axisBottom(xScale).ticks(5);
        let yAxis = d3.axisLeft(yScale).ticks(10);
        
        svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis);
        svg.append('text')
            .attr("x", chartWidth / 2 )
            .attr("y", chartHeight + 30)
            .attr("text-anchor", "middle")
            .text("mean");
    

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
        svg.append("text")
            .attr("x", -(chartHeight / 2))
            .attr("y", -30)
            .attr("transform", 'rotate(-90)')
            .attr("text-anchor", "middle")
            .text("Std")

    }

}

Stat.defaultProps = {
    chart: 'loading'
}


export default withFauxDOM(Stat);