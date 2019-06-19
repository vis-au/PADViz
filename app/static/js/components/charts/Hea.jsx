import React, { Component } from 'react';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';

import Tooltip from './Tooltip';


class Hea extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    state = {
        tooltip: null
    }

    setToolTip = (count, records, x, y) => {
        this.setState(state => ({
            tooltip: (count > 0) ? {count, records, x, y} : null
        }))
    }

    tooltipProps = () => {
        const { count, records, x, y } = this.state.tooltip;
        
        if(this.state.tooltip) {
            return {
                content: `No. of records: ${count}, records IDs: ${records}`,
                style: {top: y - 10, left: x - 30}
            }
        } else {
            return {
                style: {visibility: 'hidden'}
            }
        }
    }

    changeSelectEle(indexes, len) {
        const {
            indexMap,
            name
        } = this.props;

        if(indexes && indexes.length) {
            let idxSet = new Set([]);
            
            indexes.forEach(function(idx) {
                if(idx in indexMap) {
                    indexMap[idx].forEach(function(v){
                        idxSet.add(v);
                    })
                }
                
            });
            for(let i = 0; i < len; i++) {
                let node = d3.select(`.rect-${i}`);
                let count = node.attr('count');
                if(count > 0 && !(idxSet.has(i))) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.grayScale(count))
                        // .attr("stroke", "none");
                } else if(count > 0) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.colorScale(count));
                }
            }
            this.setState({idxSet: idxSet});
        } else if(this.state.idxSet) {
            for(let i = 0; i < len; i++) {
                let node = d3.select(`#${name}-${i}`);
                let count = node.attr('count');
                if(count > 0) {
                    node.transition()
                        .duration(800)
                        .attr('fill', this.state.colorScale(count))
                        // .attr('stroke', "none");
                    }
            }
            this.setState({idxSet: null});
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

    componentDidMount() {
        this.renderD3();
    }

    renderD3() {
        const {
            width,
            height,
            data,
            connectFauxDOM,
            animateFauxDOM
        } = this.props;

        const margin = {top: 20, right: 100, bottom: 50, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart');
        let svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const t_interval = d3.map(data, function(d){return d.time;}).keys();
        const amp_range = d3.map(data, function(d){return d.amp_interval;}).keys();

        const xScale = d3.scaleBand()
            .range([ 0, chartWidth])
            .domain(t_interval)
            .padding(0.001);
        
        const yScale = d3.scaleBand()
            .range([ chartHeight-55, 0 ])
            .domain(amp_range)
            .padding(0.01);

        let rectWidth = xScale.bandwidth();
        let rectHeight = yScale.bandwidth();

        svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(-${rectWidth / 2}, ${chartHeight - 55})`)
            .attr("class", `heatmap x axis`)
            .call(d3.axisBottom(xScale))
                .select(".domain").remove();
            
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(0, -${rectHeight / 2})`)
            .attr("class", `heatmap y axis`)
            .call(d3.axisLeft(yScale).tickFormat(d => ('< ' + d.split('-')[1])))
            .select(".domain").remove();
        
        svg.append('text')
            .attr("x", chartWidth / 2 )
            .attr("y", chartHeight - 10)
            .attr("text-anchor", "middle")
            .text("time period");

        svg.append("text")
            .attr("x", -(chartHeight / 2))
            .attr("y", -50)
            .attr("transform", 'rotate(-90)')
            .attr("text-anchor", "middle")
            .text("bins")
        
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

        // LEGEND
        let noColors = colorDomain.length;
        let legendEleHeight = rectHeight * amp_range.length / noColors;
        const legendEleWidth = 40;
        let legend = svg.selectAll(".rect")
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

        
        let rects = svg.selectAll(".rect")
            .data(data);
        
        rects.exit()
            .transition()
                .attr("stroke", "none")
                .attr('width', 0)
                .attr('height', 0).remove();

        rects = rects.enter().append("rect")
                .attr("width", 0 )
                .attr("height", 0 )
                .attr("stroke", "none")
            .on('mouseover', (d, i) => {
                if(d.count > 0) {
                    d3.select(`.rect-${i}`)
                        .attr("stroke", "	#5e9aff")
                        .attr("stroke-width", "4px");
                    this.setToolTip(d.count, d.instances, xScale(d.time), yScale(d.amp_interval));
                }
            })
            .on('mouseout', (d, i) => {
                if(d.count > 0) {
                    // if(this.state.selEle !== i) {
                    d3.select(`.rect-${i}`)
                        .attr("stroke", "none")
                    // }
                    this.setToolTip(null);
                }
            })
            .on('click', (d, i) => {
                if(d.count > 0)  {
                    // setClickHm(this.props.name);
                    this.changeSelectEle(d.instances, data.length);
                    d3.select(`.rect-${i}`)
                        .attr("stroke", "#0098d8")
                        .attr("stroke-width", "4px");
                } 
                
                // if(d.instances && d.instances.length) {
                //     console.log(d.instances)
                //     setIndexes(d.instances);
                //     setTime(d.time);
                // } else {
                //     setIndexes([]);
                // }
            })
            .merge(rects);
            
        rects.attr('class', (d, i) => `rect rect-${i}`)
            // .attr('id', (d, i) => `${name}-${i}`)
            .attr("x", function(d) { return xScale(d.time) })
            .attr("y", function(d) { return yScale(d.amp_interval) })
            .attr("count", d=>d.count)
            .attr("fill", d => colorScale(d.count))
            .transition()
                .attr("width", rectWidth )
                .attr("height", rectHeight );
        
            animateFauxDOM(1000);

    }
}

Hea.defaultProps = {
    chart: 'loading'
};

export default withFauxDOM(Hea);