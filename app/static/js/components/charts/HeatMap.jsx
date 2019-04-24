import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'
import { withFauxDOM } from 'react-faux-dom';

import Tooltip from './Tooltip';

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);
        // this.setToolTip = this.setToolTip.bind(this);
    }
    
    state = {
        tooltip: null,
        idxSet: null,
        colorScale: null
    }

    setToolTip = (count, x, y) => {
        this.setState(state => ({
            tooltip: (count > 0) ? {count, x, y} : null
        }))
    }

    tooltipProps = () => {
        const { count, x, y } = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: count,
                style: {top: y, left: x + 80}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }

    componentDidMount() {
        this.renderD3();
    }

    componentDidUpdate(prevProps) {
        if(this.props.hover !== prevProps.hover) {
            this.updateD3();
            // this.renderD3()
        }
        
    }

    render() {
        return (
            <div className="heatmap">
                {this.props.chart}
                {this.state.tooltip && <Tooltip {...this.tooltipProps() } />}
            </div>
        )
    }

    updateD3() {
        const {
            initData,
            indexMap,
            hover,
            type
        } = this.props;
        // let svg = d3.select(faux).select('svg');
        if(hover) {
            let idxSet = new Set([]);
            hover.forEach(function(idx) {
                indexMap[idx].forEach(function(v){
                    idxSet.add(v);
                })
            })
            for(let i = 0; i < initData.length; i++) {
                let node = d3.select(`#${type}-${i}`);
                let count = node.attr('count');
                if(count > 0 && !(idxSet.has(i))) {
                    node.attr('fill', "#aaaaaa");
                }
            }
            this.setState({idxSet: idxSet});
        } else {
            if(this.state.idxSet){
                for(let i = 0; i < initData.length; i++) {
                    if(!this.state.idxSet.has(i)) {
                        let node = d3.select(`#${type}-${i}`);
                        let count = node.attr('count');
                        if(count > 0) node.attr('fill', this.state.colorScale(count));
                }}
            }
           this.setState({idxSet: null});   
        }
    }

    renderD3() {
        const {
            width,
            height,
            initData,
            indexMap,
            connectFauxDOM,
            animateFauxDOM,
            setIndexes,
            setHover,
            setTime,
            setHMIdx,
            hover,
            type
        } = this.props;

        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart')
        // Initialize
        const svg = d3.select(faux).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const t_interval = d3.map(initData, function(d){return d.time;}).keys();
        const amp_range = d3.map(initData, function(d){return d.amp_interval;}).keys();

        // Build X scales and axis:
        const xScale = d3.scaleBand()
            .range([ 0, chartWidth])
            .domain(t_interval)
            .padding(0.001);
        
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + (chartHeight-55) + ")")
            .call(d3.axisBottom(xScale).tickSize(0))
            .select(".domain").remove();
        
        // Build Y scales and axis:
        const yScale = d3.scaleBand()
            .range([ chartHeight-55, 0 ])
            .domain(amp_range)
            .padding(0.01);

        svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(yScale).tickSize(0))
            .select(".domain").remove();

        const colorHold = ['#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'];
        const colorLText = ['1', '2', '<4', '<8', '<16', '<32', '<64', '<128', '<256', '<512']
        
        let colorDomain = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
        const colorScale = d3.scaleThreshold()
            .range(colorHold)
            .domain(colorDomain);
        this.setState({colorScale});

        let rectWidth = xScale.bandwidth();
        let rectHeight = yScale.bandwidth();
        const legendEleWidth = 40;
        
        let legend = svg.selectAll()
                        .data(colorDomain)
                        .enter();
        
        legend.append("rect")
            .attr("class", "legend")
            .attr("x", chartWidth+20)
            .attr("y", function(d, i) { return rectHeight*i })
            .attr("width", legendEleWidth)
            .attr("height", rectHeight)
            .style("fill", (d, i) => colorHold[i]);

        legend.append("text")
            .style("fill", "black")
            .style("text-anchor", "middle")
            .attr("class", "mono")
            .text((d, i) => colorLText[i])
            .attr("x", chartWidth+77)
            .attr("y", function(d, i) { return rectHeight*i })
            .attr("dy", rectHeight/2)
            .style("font-size", "12px");

        
        let rects = svg.selectAll()
            .data(initData)
            
        rects.exit().transition().style("fill", "#666666").remove();
        let allIdx = new Set([])
        rects = rects.enter().append("rect")
                .attr('class', `rect ${type}`)
                .attr('id', (d, i) => {
                    if(d.count !== 0) allIdx.add(i);
                    return `${type}-${i}`})
                .attr("x", function(d) { return xScale(d.time) })
                .attr("y", function(d) { return yScale(d.amp_interval) })
                .attr("width", rectWidth )
                .attr("height", rectHeight )
                .attr("count", d=>d.count)
                .attr("fill", function(d) { return d.count > 0 ? colorScale(d.count) : "#F8F7F7" })
                .style("stroke-width", 4)
                .style("stroke", "none")
            .on('mouseover', (d, i) => {
                
                if(d.count > 0) { 
                    this.setToolTip(d.count, xScale(d.time), yScale(d.amp_interval));
                    setHover(d.instances);
                    let idxSet = new Set([]);
                    d.instances.forEach(function(idx) {
                        indexMap[idx].forEach(function(v){
                            idxSet.add(v);
                        })
                    })
                    for(let idx of allIdx) {
                        if(!idxSet.has(idx)) {
                            d3.select(`#${type}-${idx}`).attr('fill', "#aaaaaa");
                    }}

                    this.setState({idxSet: idxSet});
                }
            })
            .on('mouseout', (d, i) => {
                this.setToolTip(null);
                setHover(null);
                if(this.state.idxSet){
                    for(let idx of allIdx) {
                        if(!this.state.idxSet.has(idx)) {
                            let node = d3.select(`#${type}-${idx}`);
                            let count = node.attr('count');
                            node.attr('fill', colorScale(count));
                    }}
                }
               this.setState({idxSet: null});   
            })
            .on('click', d=>{
                setIndexes(d.instances);
                setTime(d.time)
            })
            .merge(rects);
        
        rects.transition()
            .attr("fill", function(d) { return d.count > 0 ? colorScale(d.count) : "#F8F7F7" });

        animateFauxDOM(800);
    }

}

HeatMap.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

HeatMap.defaultProps = {
    chart: 'loading'
};

export default withFauxDOM(HeatMap);
