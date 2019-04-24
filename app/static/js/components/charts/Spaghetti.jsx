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
            connectFauxDOM,
            animateFauxDOM
        } = this.props;

        const render = mode === 'render'
        const update = mode === 'update'
        
        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart')
        let svg;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linecap", "round");
        } else if(update) {
            svg = d3.select(faux).select('svg').select('g');
        }

        
        let data = this.initDataTransformer(initData);
        if(indexes && indexes.length > 0) {
            data = data.filter(d => indexes.includes(parseInt(d.r_id)))
        } else {
            data = data.filter(d => ["1", "10", "20"].includes(d.r_id))
        }
        const time = data[0].values.map(v => v.time);

        let xScale = d3.scalePoint()
                        .domain(time)
                        .range([0, chartWidth]);

        let yScale = d3.scaleLinear()
            .domain([0, 220]).nice()
            .range([chartHeight, 0]);
        
        const xAxis = d3.axisBottom(xScale).tickValues(time.filter((d, i) => !(i % 4)));
        const yAxis = d3.axisLeft(yScale)
                        .ticks(10);
        
        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.power));

        let pathes = svg.selectAll("path").data(data);

        pathes = pathes
            .join("path")
            .style("mix-blend-mode", "multiply")
            .style("stroke", "#666666")
            .attr('class', d => `spagetti line data data-${d.r_id}`)
            .attr("d", d => line(d.values))
            .on('mouseover', d => {
                setHover([d.r_id]);
                d3.select(`.spagetti.data-${d.r_id}`).attr("stroke", "#005073").attr("stroke-width", 3);
            })
            .on('mouseleave', d => {
                setHover(null);
                d3.select(`.spagetti.data-${d.r_id}`).attr("stroke", "#666666").attr("stroke-width", 1.5);
            })
            .merge(pathes);

        pathes
            .transition()
            .attr("d", d => line(d.values))
            .attr("stroke", "#666666")
            .attr('stroke-width', 1.5);
        pathes.exit().transition().attr('stroke-width', 0).remove();
        animateFauxDOM(800);

        if(render) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .style('fill', 'darkOrange')
                .call(xAxis)
                
            svg.append('g').attr('class', 'y axis').call(yAxis);
        } else if(update) {
            svg.select('g.x.axis').call(xAxis)
            svg.select('g.y.axis').call(yAxis)
        }
    }
    
}

export default withFauxDOM(Spaghetti);