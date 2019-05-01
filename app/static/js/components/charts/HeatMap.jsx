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
    }
    
    state = {
        tooltip: null,
        selectedList: [],
        idxSet: null,
        isSelected: false,
        colorScale: null,
        grayScale: null
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
                content: `No. of records: ${count}`,
                style: {top: y - 10, left: x - 30}
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

    select(indexes, len) {
        const {
            indexMap,
            type
        } = this.props;

        if(indexes.length) {
            let idxSet = new Set([]);
            indexes.forEach(function(idx) {
                indexMap[idx].forEach(function(v){
                    idxSet.add(v);
                })
            });
            for(let i = 0; i < len; i++) {
                let node = d3.select(`#${type}-${i}`);
                let count = node.attr('count');
                if(count > 0 && !(idxSet.has(i))) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.grayScale(count));
                } else if(count > 0) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.colorScale(count));
                }
            }
            this.setState({idxSet: idxSet});
        } else if(this.state.idxSet) {
            // console.log(indexes)
            for(let i = 0; i < len; i++) {
                let node = d3.select(`#${type}-${i}`);
                let count = node.attr('count');
                if(count > 0) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.colorScale(count));}
            }
            this.setState({idxSet: null});
        }
    }

    updateD3() {
        const {
            initData,
            indexMap,
            hover,
            type
        } = this.props;

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
        // Build X Y scales
        const xScale = d3.scaleBand()
            .range([ 0, chartWidth])
            .domain(t_interval)
            .padding(0.001);
        
        const yScale = d3.scaleBand()
            .range([ chartHeight-55, 0 ])
            .domain(amp_range)
            .padding(0.01);

        // COLORSCALE
        const colorHold = ['#F8F7F7', '#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'];
        const grayHold = ['#F8F7F7', '#878787','#929292','#9c9c9c','#a9a9a9','#b3b3b3','#bfbfbf','#cbcbcb','#d6d6d6','#e3e3e3','#eeeeee'];
        const colorLText = ['  0', '  1', '  2', '< 4', '< 8', '< 16', '< 32', '< 64', '< 128', '< 256', '< 512']
        
        let colorDomain = [1, 1.1, 2.1, 4.1, 8.1, 16.1, 32.1, 64.1, 128.1, 256.1, 512.1];
        const colorScale = d3.scaleThreshold()
            .range(colorHold)
            .domain(colorDomain);
        const grayScale = d3.scaleThreshold()
            .range(grayHold)
            .domain(colorDomain);
        this.setState({colorScale: colorScale, grayScale: grayScale});

        let rectWidth = xScale.bandwidth();
        let rectHeight = yScale.bandwidth();
        
        // LEGEND
        let noColors = colorDomain.length;
        let legendEleHeight = rectHeight * amp_range.length / noColors;
        const legendEleWidth = 40;
        let legend = svg.selectAll()
                        .data(colorDomain)
                        .enter();
        
        legend.append("rect")
            .attr("class", "legend")
            .attr("x", chartWidth+20)
            .attr("y", function(d, i) { return legendEleHeight*i})
            .attr("width", legendEleWidth)
            .attr("height", legendEleHeight)
            .style("fill", (d, i) => i === 0 ? colorHold[i] : colorHold[noColors - i]);

        legend.append("text")
            .style("fill", "black")
            .style("text-anchor", "middle")
            .attr("class", "legend-label")
            .text((d, i) => i===0 ? colorLText[i] : colorLText[noColors - i])
            .attr("x", chartWidth+77)
            .attr("y", function(d, i) { return legendEleHeight*i })
            .attr("dy", legendEleHeight/2)
            .style("font-size", "12px");

        
        let rects = svg.selectAll()
            .data(initData)
            
        rects = rects.enter().append("rect")
                .attr('class', `rect ${type}`)
                .attr('id', (d, i) => `${type}-${i}`)
                .attr("x", function(d) { return xScale(d.time) })
                .attr("y", function(d) { return yScale(d.amp_interval) })
                .attr("width", rectWidth )
                .attr("height", rectHeight )
                .attr("count", d=>d.count)
                .attr("fill", d => colorScale(d.count))
            .on('mouseover', (d, i) => {
                if(d.count > 0) {
                    d3.select(`#${type}-${i}`)
                        .attr("stroke", "#ffa845")
                        .attr("stroke-width", "4px");

                    this.setToolTip(d.count, xScale(d.time), yScale(d.amp_interval));
                }
            })
            .on('mouseout', (d, i) => {
                if(d.count > 0) {
                    d3.select(`#${type}-${i}`)
                    .attr("stroke", "none")
                    .attr("stroke-width", "0");

                    this.setToolTip(null);
                }
            })
            .on('click', (d, i) => {
                
                if(d3.event.shiftKey) {
                    if(d.count > 0)  this.setState(prevState => ({
                        selectedList: [...prevState.selectedList, ...d.instances]}))
                    // console.log(this.state.selectedList)
                    // this.select(new Set(this.state.selectedList), initData.length)
                } else if(this.state.selectedList.length) {
                    console.log(this.state.selectedList)
                } else {
                    this.select(d.instances, initData.length);
                }
                
                if(d.instances && d.instances.length) {
                    setIndexes(d.instances)};
                    setTime(d.time);
            });
        
        // X, Y axis
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(0, ${chartHeight - 55})`)
            .call(d3.axisBottom(xScale))
                .select(".domain").remove();
            
        svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(yScale).tickFormat(d => ('< ' + d.split('-')[1])))
            .select(".domain").remove();
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
