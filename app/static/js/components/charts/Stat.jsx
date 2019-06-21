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

    setToolTip = (x, y, ids) => {
        this.setState({
            tooltip: ids ? {x, y, ids} : null
        })
    }

    tooltipProps = () => {
        let {x, y, ids} = this.state.tooltip;

        if(this.state.tooltip) {
            return {
                content: `id: ${ids.join(" ")}`,
                style: {top: y, left: x}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }

    round(n) {
        return Math.round(min * 100) / 100;
    }

    componentDidMount() {
        this.renderD3("render")
    }

    componentDidUpdate(prevProps) {
        if(this.props.global_indexes != prevProps.global_indexes) {
            this.renderD3("update")
        }
        if(this.props.global_hover != prevProps.global_hover) {
            this.updateDots(this.props.global_hover, prevProps.global_hover);
            if(this.props.global_hover.length > 0) this.setToolTip(this.state.pos_x, this.state.pos_y, this.props.global_hover);
            else this.setToolTip(null);
        }
        if(this.props.data !== prevProps.data) {
            this.renderD3("load");
        }
    }

    updateDots(ids, prevIds) {
        let { groups } = this.props;

        // de-highlight previous dots
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
        // highlight select lines
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
        d3.select(`.${this.props.name}.data-${id}`)
            .attr("r", 15)
            .attr("opacity", 1)
            .attr("fill","#18da3b")
            .raise();
    }

    deHighlight(id) {
        d3.select(`.${this.props.name}.data-${id}`)
            .attr("r", 7.5)
            .attr("opacity", 0.7)
            .attr("fill","#000000")
            .order();
    }

    

    render() {
        return (
            <div className="stat-scatter">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </div>
        )
    }

    renderD3(mode) {
        let {
            width,
            height,
            name,
            data,
            groups,
            statxy,
            global_indexes,
            setGlobalHover,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;

        const render = mode === 'render';
        const update = mode === 'update';
        const load = mode === 'load';

        const margin = {top: 20, right: 20, bottom: 40, left: 80};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        this.setState({pos_x: chartWidth, pos_y: margin.top});

        let faux = connectFauxDOM('div', 'chart');
        let svg;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);
        } else if (update ) {
            if(global_indexes) {
                let index_list;
                if(!Array.isArray(groups)) {
                    index_list = global_indexes.map(v => {
                        if(groups[v].length === 1) return groups[v][0];
                        else return v;
                    })
                } else index_list = global_indexes;

                data = data.filter(d => index_list.includes(d.index))
            } 
            
            svg = d3.select(faux).select('svg').select('g');
        } else if(load) {
            svg = d3.select(faux).select('svg').select('g');
        }

        let xScale, yScale;
    
        xScale = d3.scaleLinear()
            .domain([0, statxy[0]]).nice()
            .range([0, chartWidth]);
        
        yScale = d3.scaleLinear()
            .domain([0, statxy[1]]).nice()
            .range([chartHeight, 0]);

        let dots = svg.selectAll('circle')
                    .data(data);

        dots.exit().transition().attr('r', 0).remove();
       
        dots = dots
                .enter()
                .append("circle")
                .on('mouseover', (d, i) => {
                    let info = !Array.isArray(groups) ? groups[d.index] : [d.index];
                    setGlobalHover(info);
                })
                .on('mouseout', (d, i) => {
                    setGlobalHover([])
                })
                .merge(dots);
    
        dots
            .attr("r", 0)
            .attr("cx", function (d) { return xScale(d.mean); } )
            .attr("cy", function (d) { return yScale(d.std); } )
            .attr("mean", d => d.mean)
            .attr("std", d => d.std)
            .attr("opacity", 0)
            .attr("class", d => `${name} dot data data-${d.index}`)
            .transition()
                .attr("r", 7.5)
                .attr("opacity", 0.7);

        animateFauxDOM(1000);

        let xAxis = d3.axisBottom(xScale).ticks(10);
        let yAxis = d3.axisLeft(yScale).ticks(10);
        
        if(render) {
            svg.append('g')
                .attr('class', `${name} x axis`)
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(xAxis);
            svg.append('text')
                .attr("x", chartWidth / 2 )
                .attr("y", chartHeight + 30)
                .attr("text-anchor", "middle")
                .text("mean");
        

            svg.append('g')
                .attr('class', `${name} y axis`)
                .call(yAxis);
            svg.append("text")
                .attr("x", -(chartHeight / 2))
                .attr("y", -30)
                .attr("transform", 'rotate(-90)')
                .attr("text-anchor", "middle")
                .text("std")
        } else if(load) {
            svg.select(`.${name}.x.axis`)
                .transition()
                .call(xAxis);
            svg.select(`.${name}.y.axis`)
                .transition()
                .call(yAxis);
        }
        

    }

}

Stat.defaultProps = {
    chart: 'loading'
}


export default withFauxDOM(Stat);