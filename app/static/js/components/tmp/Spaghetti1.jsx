import React, {Component} from 'react';
import * as d3 from 'd3';
// import { deflateRaw } from 'zlib';

export default class Spaghetti1 extends Component {

    constructor(props){
        super(props);
        this.createSpaghetti = this.createSpaghetti.bind(this);
    }

    componentDidMount() {
        this.createSpaghetti();
    }

    componentDidUpdate() {
        this.createSpaghetti();
    }

    createSpaghetti() {
        // const node = this.node;
        const margin = {top: 10, right: 180, bottom: 10, left: 50};
        const height = 400;
        const width = 1400;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3.select(".spaghetti1")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
        d3.json("/json/line?type=s2").then(function(data){
            color.domain(d3.keys(data[0]).filter(function(key){
                return key != "time";
            }))

            const energies = color.domain().map(function(r){
                return {
                    r_id: r,
                    values: data.map(function(d){
                        return {
                            time: d.time,
                            power: +d[r]
                        }
                    })
                }
            });
            const time = data.map(d=>{return d.time});
            // console.log(time)

            const x = d3.scaleLinear()
                .domain(d3.extent(energies[0].values, d=>d.time))
                .range([margin.left, width - margin.right])
            svg.append('g')
                .attr("transform", "translate(0," + (height-margin.bottom+2) + ")")
                .call(d3.axisBottom(x).tickSize(0))
            
            const y = d3.scaleLinear()
                // .domain([0, d3.max(energies, d => d3.max(d.values, v=>{return v.power;}))]).nice()
                .domain([0, 220])
                .range([height - margin.bottom, margin.top])
            svg.append('g')
                .attr("transform", "translate(" +margin.left +",2)")
                .call(d3.axisLeft(y).tickSize(0))
                // .call(g => g.select(".domain").remove())
                // .call(g => g.select(".tick:last-of-type text").clone()
                //     .attr("x", 3)
                //     .attr("text-anchor", "start")
                //     .attr("font-weight", "bold")
                //     .text("energy"))
            
            const line = d3.line()
                .curve(d3.curveCardinal)
                .x(d => x(d.time))
                .y(d => y(d.power))
            
            svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                .selectAll("path")
                .data(energies)
                    .join("path")
                    .style("mix-blend-mode", "multiply")
                    .style("stroke", d => {
                        return color(d.r_id)
                    })
                    .attr("r_id", d=>d.r_id)
                    .attr("d", d => line(d.values));
        });

    }

    render() {
        return (
            <div>
                <svg className="spaghetti1"></svg>
            </div>
       )
    }
} 