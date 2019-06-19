import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'
import { withFauxDOM } from 'react-faux-dom';
// import _ from "loadsh";
import Tooltip from './Tooltip';

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }
    
    state = {
        tooltip: null,
        selEle: null,
        selIns: null,
        idxSet: null,
        colorScale: null,
        grayScale: null,
        noCells: this.props.initData.length,
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
        this.renderD3('render');
    }

    componentDidUpdate(prevProps) {
        if(this.props.initData !== prevProps.initData) {
            this.renderD3('update')
        }
        if(this.props.hover !== prevProps.hover) {
            // this.changeSelectEle(null);
            this.select(this.props.hover, this.state.noCells)
        }  
        if(this.props.indexes !== prevProps.indexes) {
            if(this.props.indexes.length === 0 && this.state.selEle) {
                this.changeSelectEle(null);
            } 
            this.select(this.props.indexes, this.state.noCells)
        }
        if(this.props.clickHm !== prevProps.clickHm) {
            if(this.props.clickHm !== this.props.name) this.changeSelectEle(null);
        }

    }

    changeSelectEle(i) {
        const { name, clickHm } = this.props;
        if(i ) {
            
            if(this.state.selEle) {
                d3.select(`#${name}-${this.state.selEle}`)
                    .attr("stroke", "none");
            }
            d3.select(`#${name}-${i}`)
                .attr("stroke", "#003366");
            this.setState({ selEle: i});
        } else {
            d3.select(`#${name}-${this.state.selEle}`)
                .attr("stroke", "none");
            this.setState({selEle: null});
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
                let node = d3.select(`#${name}-${i}`);
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

    renderD3(mode) {
        let {
            width,
            height,
            initData,
            connectFauxDOM,
            animateFauxDOM,
            setIndexes,
            setClickHm,
            setHover,
            setTime,
            setHMIdx,
            hover,
            name
        } = this.props;

        const render = mode === 'render'
        const update = mode === 'update'

        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        let faux = connectFauxDOM('div', 'chart');
        let data = initData;
        let svg;
        if(render) {
            svg = d3.select(faux).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
        } else if(update) {
            svg = d3.select(faux).select('svg').select('g');
            setIndexes([]);
            if(this.state.selEle) this.changeSelectEle(null);
        }

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
            .data(initData);

        rects.exit().transition().attr("stroke", "none").attr('width', 0).attr('height', 0).remove();
            
        rects = rects.enter().append("rect")
                .attr("width", 0 )
                .attr("height", 0 )
                .attr("stroke", "none")
            .on('mouseover', (d, i) => {
                if(d.count > 0) {
                    d3.select(`#${name}-${i}`)
                        .attr("stroke", "#6897bb")
                        .attr("stroke-width", "4px");
                    this.setToolTip(d.count, xScale(d.time), yScale(d.amp_interval));
                }
            })
            .on('mouseout', (d, i) => {
                if(d.count > 0) {
                    if(this.state.selEle !== i) {
                        d3.select(`#${name}-${i}`)
                            .attr("stroke", "none")
                    }
                    this.setToolTip(null);
                }
            })
            .on('click', (d, i) => {
                if(d.count > 0)  {
                    setClickHm(this.props.name);
                    this.changeSelectEle(i);
                } 
                
                if(d.instances && d.instances.length) {
                    console.log(d.instances)
                    setIndexes(d.instances);
                    setTime(d.time);
                } else {
                    setIndexes([]);
                }
            })
            .merge(rects);
            
        rects.attr('class', `rect ${name}`)
            .attr('id', (d, i) => `${name}-${i}`)
            .attr("x", function(d) { return xScale(d.time) })
            .attr("y", function(d) { return yScale(d.amp_interval) })
            .attr("count", d=>d.count)
            .attr("fill", d => colorScale(d.count))
            .transition()
                .attr("width", rectWidth )
                .attr("height", rectHeight );
        
            animateFauxDOM(1000);
        
        // X, Y axis
        if(render) {
            svg.append("g")
                .style("font-size", 12)
                .attr("transform", `translate(-${rectWidth / 2}, ${chartHeight - 55})`)
                .attr("class", `heatmap ${name} x axis`)
                .call(d3.axisBottom(xScale))
                    .select(".domain").remove();
                
            svg.append("g")
                .style("font-size", 12)
                .attr("transform", `translate(0, -${rectHeight / 2})`)
                .attr("class", `heatmap ${name} y axis`)
                .call(d3.axisLeft(yScale).tickFormat(d => ('< ' + d.split('-')[1])))
                .select(".domain").remove();

            svg.append("text")
                .attr('transform', `translate(${chartWidth}, ${chartHeight - 37})`)
                .attr('class', 'label')
                .style('text-anchor', 'middle')
                .text("time")
                    .style("font-size", 14)
                    .attr('stroke', '#003366');
            svg.append("text")
                .attr('class', 'label')
                .style('text-anchor', 'middle')
                .text("Bins range")
                    .style("font-size", 14)
                    .attr("transform", `translate(-60, ${chartHeight / 2 -10}), rotate(-90)`)
                    .attr('stroke', '#003366');
        }
        
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
