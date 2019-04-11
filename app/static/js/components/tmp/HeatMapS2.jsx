import React, { Component } from 'react';
import * as d3 from 'd3';

class HeatMapS2 extends Component {

    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    componentDidMount() {
        this.renderD3();
    }

    render() {
        return (
            <div id="s2hm">
            </div>
        )
    }

    renderD3 () {
        const margin = {top: 20, right: 100, bottom: 20, left: 100};
        const graphWidth = 1400-margin.left-margin.right;
        const height = 400 - margin.top - margin.bottom;
        const gridSize = Math.floor(height / 10);
        const legendWidth = gridSize + 10

        const svg = d3.select('#s2hm').append("svg")
        .attr("width", graphWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // const svg = d3.select('#orihm').append('svg');

        d3.json("json/heatmap?type=s2").then(function(data){
            svg
            .attr("width", graphWidth + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            const t_interval = d3.map(data, function(d){return d.time;}).keys();
            const amp_range = d3.map(data, function(d){return d.amp_interval;}).keys();
            
            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([ 0, graphWidth])
                .domain(t_interval)
                .padding(0.001);

            svg.append("g")
                .style("font-size", 12)
                .attr("transform", "translate(0," + (height-55) + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .select(".domain").remove();
            
            // Build Y scales and axis:
            const y = d3.scaleBand()
                .range([ height-55, 0 ])
                .domain(amp_range)
                .padding(0.01);

            svg.append("g")
                .style("font-size", 12)
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove();

            const colorHold = ['#8b0000','#aa0e27','#c52940','#db4551','#ed645c','#fa8266','#ffa474','#ffc58a','#ffe3af','#ffffe0'];
            const colorLText = ['1', '2', '<4', '<8', '<16', '<32', '<64', '<128', '<256', '<512']
            
            const scale = d3.scaleThreshold()
            .range(colorHold)
            .domain([1, 2, 4, 8, 16, 32, 64, 128, 256, 512]);

            

            const tooltip = svg.append('div').style("width","80px").style("height","40px").style("background","#C3B3E5")
            .style("opacity","1").style("position","absolute").style("visibility","hidden").style("box-shadow","0px 0px 6px #7861A5").style("padding","10px");
            // const toolval=tooltip.append("div");

            svg.selectAll()
                .data(data, function(d) {return d.time+':'+d.amp_interval;})
                .enter()
                .append("rect")
                    .attr("x", function(d) { return x(d.time) })
                    .attr("y", function(d) { return y(d.amp_interval) })
                    .attr("width", x.bandwidth() )
                    .attr("height", y.bandwidth() )
                    .attr("value", d=>d.count)
                    .style("fill", function(d) {
                        if(d.count == 0) {
                            return d3.rgb("#F8F7F7");
                        } else {
                            return scale(d.count);
                        }
                    })
                    .style("stroke-width", 4)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                    .on('mouseover', d => {
                        // d3.select(this).style("stroke","orange").style("stroke-width","3px")
                    })
                    .on('mouseout', d => {
                        // d3.select(this).style("stroke","none");
                    })
                    .on('mousemove', d=>{
                        // tooltip.style("visibility","visible");
                        // tooltip.select("div").html("<strong>"+d.product+"</strong><br/> "+(+d.value).toFixed(2))
                    })
                    // .on('click', d=>{
                    //     console.log(d)
                    // });

        });
    }
}

export default HeatMapS2;