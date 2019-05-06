import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'
import { withFauxDOM } from 'react-faux-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`

class Spaghetti extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        data: this.initDataTransformer(this.props.initData)
    }

    componentDidMount() {
        this.renderD3('render')
    }

    componentDidUpdate(prevProps) {
        if(this.props.indexes !== prevProps.indexes) {
            this.renderD3('update')
        }
        
    }

    render() {
        return (
            <Wrapper className="spaghetti">
                {this.props.chart}
            </Wrapper>
        )
    }

    initDataTransformer(initData) {
        const keys = Object.keys(initData[0]).filter(k => {return k !== 'time'; });

        return keys.map(function(r){
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
    }

    renderD3(mode) {
        const {
            width,
            height,
            initData,
            indexes,
            setHover,
            name,
            connectFauxDOM,
            animateFauxDOM
        } = this.props;

        const render = mode === 'render'
        const update = mode === 'update'
        
        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart')
        let svg, data, time;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("fill", "none")
                    .attr("stroke-linejoin", "round")
                    // .attr("stroke-width", 1.5)
                    .attr("stroke-linecap", "round");
                this.setState({data: this.initDataTransformer(initData)});
                data = this.state.data[0];
                time = data.values.map(v => v.time);
        } else if(update) {
            if(indexes && indexes.length > 0) {
                data = this.state.data.filter(d => indexes.includes(parseInt(d.r_id)))
            }
            time = data[0].values.map(v => v.time);
            svg = d3.select(faux).select('svg').select('g');
        }
        // console.log(data, time)

        let xScale = d3.scaleBand()
                        .domain(time)
                        .range([0, chartWidth]);

        let yScale = d3.scaleLinear()
            .domain([0, 220]).nice()
            .range([chartHeight, 0]);
        
        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.power));
        
        let lines = svg.selectAll(".line")
                        .data(data);
        lines.exit().remove();
        lines = lines.enter()
                .append("path")
                    .style("mix-blend-mode", "multiply")
                    .on('mouseover', d => {
                        setHover([d.r_id]);
                    })
                    // .on('mouseleave', d => {
                    //     setHover(null);
                    // })

                    .merge(lines);

        lines
            .attr("class", d => `${name} line data data-${d.r_id}`)
            .attr("d", d => line(d.values))
            .attr("stroke", "#666666")
            .attr('stroke-width', 0.5)
            .transition()
            .attr('stroke-width', 1.5);
        
        
        // let dots = svg.selectAll("dots")
        //                 .data(data).enter()
        //                 .selectALL
        //                 .data(d => d.values).enter();
        
        // dots.exit().transition().attr('r', 0).remove();
        
        // dots = dots.enter()
        //         .append("circle")
        //         .on("mouseout", d => {})
        //         .merge(dots);
        
        // dots
        //     .attr("class", `${name} circle `)
        //     .attr("cx", d => {console.log(d); return xScale(d.time)})
        //     .attr("cy", d => yScale(d.power))
        //     .transition()
        //     .attr("r", 4)
        //     .attr("fill", "#999999");
    
        animateFauxDOM(800);

        const xAxis = d3.axisBottom(xScale).tickSize(0).tickValues(time.filter((d, i) => (i === 0 || !(i % 3)) ? i : null));
        const yAxis = d3.axisLeft(yScale)
                        .ticks(10);
        if(render) {
            svg.append('g')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis);
            
            svg.append("text")
                .attr('transform', `translate(${chartWidth - 10}, ${chartHeight - 5})`)
                .attr('class', 'axis label')
                .style('text-anchor', 'middle')
                .text("time")
                    .style("font-size", 14)
                    .attr("fill", "black");
                
            svg.append('g').attr('class', 'y axis').call(yAxis);

            svg.append("text")
                .attr('transform', `translate(${margin.left - 70}, ${margin.top})`)
                .attr('class', 'axis label')
                .style('text-anchor', 'middle')
                .text("values")
                    .style("font-size", 14)
                    .attr("fill", "black");
        }
    }
    
}

export default withFauxDOM(Spaghetti);