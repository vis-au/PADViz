import * as d3 from 'd3';

export default class MultiLines {
  constructor(data) {
    this.data = data;
  }

  create(el, props, state) {
    const data = this.data;
    var width = 500;
    var height = 300;
    var margin = 50;
    var duration = 250;
    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;
    console.log(data[0].values)
    /* Format Data */
    var parseDate = d3.timeParse("%Y");
    data.forEach(function(d) { 
      d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.price = +d.price;    
      });
    });
    /* Scale */
    var xScale = d3.scaleTime()
                .domain(d3.extent(data[0].values, d => d.date))
                .range([0, width-margin]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.price)])
    .range([height-margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var svg = d3.select(el).append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);

    /* Add line into SVG */
    var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price));
    
    let lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')  
      .on("mouseover", function(d, i) {
          svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))        
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
      .on("mouseout", function(d) {
          svg.select(".title-text").remove();
        })
      .append('path')
      .attr('class', 'line')  
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on("mouseover", function(d) {
          d3.selectAll('.line')
              .style('opacity', otherLinesOpacityHover);
          d3.selectAll('.circle')
              .style('opacity', circleOpacityOnLineHover);
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
      .on("mouseout", function(d) {
          d3.selectAll(".line")
              .style('opacity', lineOpacity);
          d3.selectAll('.circle')
              .style('opacity', circleOpacity);
          d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });


    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values).enter()
      .append("g")
      .attr("class", "circle")  
      .on("mouseover", function(d) {
          d3.select(this)     
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.price}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.price) - 10);
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")  
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.price))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .attr("r", circleRadiusHover);
          })
        .on("mouseout", function(d) {
            d3.select(this) 
              .transition()
              .duration(duration)
              .attr("r", circleRadius);  
          });


    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");

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










  

  
  
//   d3Chart.update = function(el, state) {
//     // Re-compute the scales, and render the data points
//     var scales = this._scales(el, state.domain);
//     this._drawPoints(el, scales, state.data);
//   };

//   d3Chart._scales = function(el, domain) {
//     if (!domain) {
//       return null;
//     }
  
//     var width = el.offsetWidth;
//     var height = el.offsetHeight;
  
//     var x = d3.scaleLinear()
//       .range([0, width])
//       .domain(domain.x);
  
//     var y = d3.scaleLinear()
//       .range([height, 0])
//       .domain(domain.y);
  
//     var z = d3.scaleLinear()
//       .range([5, 20])
//       .domain([1, 10]);
    
//     return {x: x, y: y, z: z};
//   };

//   d3Chart._drawPoints = function(el, scales, data) {
//     var g = d3.select(el).selectAll('.d3-points');
  
//     var point = g.selectAll('.d3-point')
//       .data(data, function(d) { return d.id; });
  
//     // ENTER
//     point.enter().append('circle')
//         .attr('class', 'd3-point test')
//         .attr('cx', function(d) { console.log(d.x);return scales.x(d.x); })
//         .attr('cy', function(d) { return scales.y(d.y); })
//         .attr("r", 0)
//         .transition()
//         .duration(800)
//         .attr('r', function(d) { return scales.z(d.z); })
//         .attr('fill', "blue");

//     // ENTER & UPDATE
//     // point.attr('cx', function(d) { console.log("x");return scales.x(d.x); })
//     //     .attr('cy', function(d) { return scales.y(d.y); })
//     //     .attr('r', function(d) { return scales.z(d.z); })
//     //     .attr('fill', "blue");
  
//     // EXIT
//     point.exit()
//         .remove();
//   };
  
//   d3Chart.destroy = function(el) {
//     // Any clean-up would go here
//     // in this example there is nothing to do
//   };
