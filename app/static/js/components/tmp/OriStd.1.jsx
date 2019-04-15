import React, { Component } from 'react';
import * as d3 from 'd3';



class OriStd1 extends Component {
    
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
            <div id="oristat2" >
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
        
        const margin = {top: 20, right: 50, bottom: 20, left: 50};
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
        
        if(chartType == "stat") {
            xMax = d3.max(data, d=> {return d.mean});
            yMax = d3.max(data, d=>{return d.std});
        } else (chartType == "amp") {
            xMax = d3.max(data, d=> {return d.min});
            yMax = d3.max(data, d=>{return d.max});
        }
        
        const x = d3.scaleLinear()
            .domain([0, xMax]).nice()
            .range([0, width]);
        const xAxisG = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
        
        xAxisG.call(d3.axisBottom(x).tickSize(0))
        svg.append("text")             
            .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("mean");

        const y = d3.scaleLinear()
            .domain([0,yMax]).nice()
            .range([ height, 0]);
        svg.append("g")
            .attr("transform", "translate(" +(margin.left -1) +",0)")
            .call(d3.axisLeft(y).tickSize(0));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -5)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("std");  

        svg.append('g')
            // .attr("transform", "translate(" + margin.left +","+ margin.bottom +")")
        .selectAll("dot")
        .data(data)
        .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.mean); } )
                .attr("cy", function (d) { return y(d.std); } )
                .attr("r", 4)
                .style("fill", d => {return color(d.index)})
                .attr('value', d => {return d.mean + "," + d.std})
            .selectAll('text')
                .text(d=> {return d.mean + "," + d.std})
                .attr("x", function(d) {
                    return x(d.mean);  // Returns scaled location of x
                })
                .attr("y", function(d) {
                    return y(d.std);  // Returns scaled circle y
                })
                .attr("font_family", "sans-serif")  // Font type
                .attr("font-size", "11px")  // Font size
                .attr("fill", "darkgreen");   // Font color
            // .on('mouseover', d => {
            //         // console.log(d);
            //     this.setTooltip(d);
            // })
            // .on('mouseout', d => {

            // })
            // .on('click', d=>{
            //     // alert(d)
            // });
        
        
        })
    }
}

export default OriStd1;