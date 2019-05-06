import * as d3 from 'd3';

export default class Heatmap {
    constructor(data, props) {
        this.data = data;
        this.margin = props.margin;
        this.width = props.width;
        this.height = props.height;
        this.charWidth = props.width - this.margin.left - this.margin.right;;
        this.charHeight = props.height - this.margin.top - this.margin.bottom;
    }

    create(node, state) {
        var svg = d3.select(node).append("svg")
                        .attr("width", this.width)
                        .attr("height", this.height)
                        .append("g")
                        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        
        const t_interval = d3.map(this.data, function(d){return d.time;}).keys();
        const amp_range = d3.map(this.data, function(d){return d.amp_interval;}).keys();

        // Build X Y scales
        const xScale = d3.scaleBand()
            .range([ 0, this.chartWidth])
            .domain(t_interval)
            .padding(0.001);
        
        const yScale = d3.scaleBand()
            .range([ this.chartHeight-55, 0 ])
            .domain(amp_range)
            .padding(0.01);

        // COLORSCALE
        const colorHold = ['#F8F7F7', '#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'];
        const grayHold = ['#F8F7F7', '#878787','#929292','#9c9c9c','#a9a9a9','#b3b3b3','#bfbfbf','#cbcbcb','#d6d6d6','#e3e3e3','#eeeeee'];
        const colorLText = ['  0', '  1', '  2', '< 4', '< 8', '< 16', '< 32', '< 64', '< 128', '< 256', '< 512']
        
        let colorDomain = [1, 1.1, 2.1, 4.1, 8.1, 16.1, 32.1, 64.1, 128.1, 256.1, 512.1];
        this.colorScale = d3.scaleThreshold()
            .range(colorHold)
            .domain(colorDomain);
        this.grayScale = d3.scaleThreshold()
            .range(grayHold)
            .domain(colorDomain);

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
            .attr("x", this.chartWidth+20)
            .attr("y", function(d, i) { return legendEleHeight*i})
            .attr("width", legendEleWidth)
            .attr("height", legendEleHeight)
            .style("fill", (d, i) => i === 0 ? colorHold[i] : colorHold[noColors - i]);

        legend.append("text")
            .style("fill", "black")
            .style("text-anchor", "middle")
            .attr("class", "legend-label")
            .text((d, i) => i===0 ? colorLText[i] : colorLText[noColors - i])
            .attr("x", this.chartWidth+77)
            .attr("y", function(d, i) { return legendEleHeight*i })
            .attr("dy", legendEleHeight/2)
            .style("font-size", "12px");
        
        var rects = svg.selectAll("rect")
            .data(this.data);
        
        rects.enter().append("rect")
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
                this.select(this.state.selectedList.length, initData.length);
            } 
            else {
                this.select(d.instances, initData.length);
            }
            
            if(d.instances && d.instances.length) {
                setIndexes(d.instances);
                setTime(d.time);
                // setHMIdx(d.instances);
            }
        });

        // X, Y axis
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(-${rectWidth / 2}, ${this.chartHeight - 55})`)
            .call(d3.axisBottom(xScale))
                .select(".domain").remove();
            
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(0, -${rectHeight / 2})`)
            .call(d3.axisLeft(yScale).tickFormat(d => ('< ' + d.split('-')[1])))
            .select(".domain").remove();
    }

    update(node) {

    }
}

// d3Chart.create = function(el, props, state) {
//   var svg = d3.select(el).append('svg')
//       .attr('class', 'd3')
//       .attr('width', props.width)
//       .attr('height', props.height);

//   svg.append('g')
//       .attr('class', 'd3-points');

//   this.update(el, state);
// };