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
        // if(this.props.lineIndexes !== prevProps.lineIndexes) {
        //     this.updateLines(this.props.lineIndexes, prevProps.lineIndexes);
        //     this.setToolTip(this.props.lineIndexes, this.state.pos_x, this.state.pos_y);
        // }
        if(this.props.global_hover !== prevProps.global_hover) {
            this.updateLines(this.props.global_hover, prevProps.global_hover);
            this.setToolTip(this.props.global_hover, this.state.pos_x, this.state.pos_y);
        }
        if(this.props.global_indexes !== prevProps.global_indexes) {
            this.renderD3("update")
        }
    }

    updateLines(ids, prevIds) {
        let {groups} = this.props;

        // de-highlight previous lines
        if(prevIds !== null) {
            if(typeof(prevIds) === "number") {
                let t_id;
                if(!Array.isArray(groups)) {
                    t_id = groups[prevIds].length == 1 ? groups[prevIds][0] : prevIds;
                } else t_id = prevIds;
                this.deHighlight(t_id);
            } else if(Array.isArray(prevIds) && prevIds.length > 0) {
                prevIds.map(id => this.deHighlight(id))
            }
            
        }
        // highlight select lines
        if(typeof(ids) === "number") {
            if(!Array.isArray(groups)) {
                let t_id = groups[ids].length == 1 ? groups[ids][0] : ids;
                groups[t_id].map(id => this.highlight(id));
            } else {
                this.highlight(ids);
            }
        } else if(Array.isArray(ids) && ids.length > 0) {
            ids.map(id => this.highlight(id));
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
            // console.log(opacity)
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
        if(typeof(info) === "number") {
            if(Array.isArray(groups) && groups.length === 0) ids = info;
            else if(groups[info].length === 1) ids = groups[groups[info][0]].join(" ");
            else if(groups[info].length > 1) ids = groups[info].join(" ");
        } else if(Array.isArray(info)) {
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
            
            setHoverLines,
            lineMax,
            global_indexes,
            setGlobalHover,

            connectFauxDOM,
            animateFauxDOM
        } = this.props;

        const render = mode === 'render';
        const update = mode === 'update';
        
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
            svg = d3.select(faux).select('svg').select('g');
            if(global_indexes) {
                data = data.filter((d, i) => global_indexes.includes(index[i]))
                index = index.filter((d, i) => global_indexes.includes(d))
            }
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
        // if(render) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(-14, ${chartHeight})`)
                .call(xAxis)

            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', `translate(-14, 0)`)
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
        // }

        let line = d3.line()
                .defined(d => !isNaN(d))
                .x((d, i) => xScale(time[i]))
                .y(d => yScale(d))
        
        let path = svg.selectAll("path")
                    .data(data);

        path = path
                .join("path")
                .on("mouseover", (d, i) => {
                    let info = groups[index[i]] ? groups[index[i]] : index[i];
                    // setHoverLines(info);
                    setGlobalHover(info);
                })
                .on("mouseout", (d, i) => {
                    // this.setToolTip(null);
                    // setHoverLines(null);
                    setGlobalHover([]);
                });
        path
            .attr('class', (d, i) =>{ 
                return `${name} data data-${index[i]}`})
            .attr("groupmembers", (d, i) => {
                return groups[index[i]]
            })
            .attr("opavalue", (d, i) => `${opacity[index[i]]}`)
            .attr("d", d=>line(d))
            .attr("stroke", "#000000")
            .attr("stroke-width", 0)
            .attr("opacity", (d, i) => {
                return opacity[i]
            })
            .transition()
            .attr("stroke-width", 2);
        
        path.exit()
            .transition()
                .attr("stroke-width", 0) 
                .remove();

        animateFauxDOM(1300);
    }
}

export default withFauxDOM(Lines);