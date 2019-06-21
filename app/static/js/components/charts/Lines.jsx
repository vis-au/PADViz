import React, { Component } from 'react';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';

import Tooltip from './Tooltip';

class Lines extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        tooltip: null,
    }

    componentDidMount() { 
        this.renderD3("render");
    }

    componentDidUpdate(prevProps) {
        if(this.props.global_hover !== prevProps.global_hover) {
            this.updateLines(this.props.global_hover, prevProps.global_hover);
            if(this.props.global_hover.length > 0) this.setToolTip(this.props.global_hover, this.state.pos_x, this.state.pos_y);
            else this.setToolTip(null)
        }
        if(this.props.global_indexes !== prevProps.global_indexes) {
            this.renderD3("update")
        }
        if(this.props.data !== prevProps.data) {
            this.renderD3("load");
        }
    }

    updateLines(ids, prevIds) {
        let {groups} = this.props;

        if(prevIds.length === 1) {
            if(Array.isArray(groups)) this.deHighlight(prevIds);
            else groups[prevIds].map(id => this.deHighlight(id));
        } else if(prevIds.length > 1) {
            if(!Array.isArray(groups)) {
                prevIds.map(id => {
                    if(groups[id].length === 1) return this.deHighlight(groups[id][0])
                    else return this.deHighlight(id)
                })
            } else prevIds.map(id => this.deHighlight(id));
        }
            
        if(ids.length  === 1) {
            if(Array.isArray(groups)) this.highlight(ids);
            else groups[ids].map(id => this.highlight(id));
        } else if(ids.length > 1) {
            if(!Array.isArray(groups)) {
                ids.map(id => {
                    if(groups[id].length === 1) return this.highlight(groups[id][0])
                    else return this.highlight(id)
                })
            } else ids.map(id => this.highlight(id));
        }
    }

    highlight(id) {
        let {name} = this.props;
        let node = d3.select(`.${name}.data-${id}`);
        if(!node.empty()) {
            node.attr("stroke", "#18da3b")
                .attr("stroke-width", 5)
                .attr("opacity", "1")
                .raise()
        }
    }

    deHighlight(id) {
        let {name} = this.props;
        let node = d3.select(`.${name}.data-${id}`);
        if(!node.empty()) {
            let opacity = node.attr("opavalue")
            node.order()
                .transition()
                .attr("stroke", "#000000")
                .attr("stroke-width", 2)
                .attr("opacity", opacity);
        }
        
    }

    render() {
        return (
            <div className="multi-lines">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </div>
      )
    }

    setToolTip = (info, x, y) => {
        this.setState(state => ({
            tooltip: info ? {info, x, y} : null
        }))
    }

    tooltipProps = () => {
        const { info, x, y } = this.state.tooltip;
        const { groups } = this.props;
       
        let ids;
        if(info.length === 1) {
            if(Array.isArray(groups)) ids = info;
            else if(groups[info].length === 1) ids = groups[groups[info][0]].join(" ");
            else if(groups[info].length > 1) ids = groups[info].join(" ");
        } else {
            ids = info.join(" ");
        }

        if(this.state.tooltip) {
            return {
                content: `Record ID(s): ${ids}`,
                style: {top: y, left: x}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }


    renderD3(mode) {
        let {
            width,
            height,
            name,
            time,
            index,
            data,
            opacity,
            groups,
            
            lineMax,
            global_indexes,
            setGlobalHover,

            connectFauxDOM,
            animateFauxDOM
        } = this.props;

        const render = mode === 'render';
        const update = mode === 'update';
        const load = mode === 'load';
        
        const margin = {top: 20, right: 100, bottom: 50, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        this.setState({pos_x: chartWidth - 40, pos_y: margin.top});
        
        let faux = connectFauxDOM('div', 'chart')
        let svg;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("fill", "none")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round");
        } else if(update) {
            svg = d3.select(faux).select('svg').select("g");
            if(global_indexes &&global_indexes.length > 0) {
                let index_list;
                if(!Array.isArray(groups)) {
                    index_list = global_indexes.map(v => {
                        if(groups[v].length === 1) return groups[v][0];
                        else return v;
                    })
                } else index_list = global_indexes;

                data = data.filter((d, i) => index_list.includes(index[i]));
                index = index.filter((d, i) => index_list.includes(d));
                opacity = opacity.filter((d) => index_list.includes(d));
            } 
        } else if(load) {
            svg = d3.select(faux).select('svg').select("g");
        }

        let xScale = d3.scaleBand()
                .domain(time)
                .range([0, chartWidth]).padding(-1);
        let yScale = d3.scaleLinear()
                        .domain([0, lineMax]).nice()
                        .range([chartHeight, 0]);
        
        let xAxis =  d3.axisBottom(xScale)
            .tickValues(xScale.domain().filter(d => (d === 0 || !(d%10))))
            .tickSizeOuter(0);
            
        let yAxis = d3.axisLeft(yScale)
                        .tickSizeInner(-chartWidth)
                        .tickSizeOuter(1)
        if(render) {
            svg.append('g')
                .attr('class', `${name} x axis`)
                .attr('transform', `translate(-14, ${chartHeight})`)
                .call(xAxis)

            svg.append('g')
                .attr('class', `${name} y axis`)
                .attr('transform', `translate(-14 0)`)
                .call(yAxis);
            
            svg.append('text')
                .attr("x", chartWidth / 2 )
                .attr("y", chartHeight + 35)
                .attr("text-anchor", "middle")
                .text("time");

            svg.append("text")
                .attr("x", -(chartHeight / 2))
                .attr("y", -40)
                .attr("transform", 'rotate(-90)')
                .attr("text-anchor", "middle")
                .text("power");
        } else {
            svg.select(`${name} x axis`)
                .transition()
                .call(xAxis);
            svg.select(`${name} y axis`)
                .transition()
                .call(yAxis);
        }

        let line = d3.line()
                .defined(d => !isNaN(d))
                .x((d, i) => xScale(time[i]))
                .y(d => yScale(d))
        
        let path = svg.selectAll(".lines")
                    .data(data);
        path.exit()
            .transition()
                .attr("stroke-width", 0) 
                .remove();
        path = path
                .enter()
                .append("path")
                // .join("path")
                // .attr("fill", "none")
                .on("mouseover", (d, i) => {
                    let info = !Array.isArray(groups) ? groups[index[i]] : [index[i]];
                    setGlobalHover(info);
                })
                .on("mouseout", (d, i) => {
                    setGlobalHover([]);
                })
                .merge(path);
        path
            .attr('class', (d, i) =>{ 
                return `${name} lines data data-${index[i]}`})
            .attr("groupmembers", (d, i) => {
                return groups[index[i]]
            })
            .attr("opavalue", (d, i) => {
                if(data.length < 5) return '1';
                else {
                    let r = opacity.indexOf(index[i]);
                    if(r <= 6) return 1
                    else return 0.1
                }
                
            })
            .attr("d", d=>line(d))
            .attr("stroke", "#000000")
            .attr("stroke-width", 0)
            .attr("opacity", (d, i) => {
                if(data.length < 5) return '1';
                else {
                    let r = opacity.indexOf(index[i]);
                    if(r <= 6) return 1
                    else return 0.1
                }
            })
            .transition()
            .attr("stroke-width", 2);
        
        

        animateFauxDOM(1300);
    }
}

export default withFauxDOM(Lines);