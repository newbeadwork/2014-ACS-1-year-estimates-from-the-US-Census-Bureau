// @TODO: YOUR CODE HERE!


//1

var svgArea = d3.select("body").select("svg");

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//2
d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log(healthData);

    // parsing the data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // creating scales
  var xPovertyScale = d3.scaleLinear()
    .domain(d3.extent(healthData, d => d.poverty))
    .range([0, width]);

  var yHealthcareScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);
  
    // creating axes
  var xAxis = d3.axisBottom(xPovertyScale);
  var yAxis = d3.axisLeft(yHealthcareScale).ticks(10);

  // appending axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  

  // appending circles
  chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthcareScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "green")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

  chartGroup.selectAll(null)
    .data(healthData)
    .enter()
    .append("g")
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xPovertyScale(d.poverty))
    .attr("y", d => yHealthcareScale(d.healthcare))
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("fill", "gold");

  chartGroup.append("text")
    // Position the text
    // Center the text:
    // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .text("In Poverty (%");

  // y-axis title
  chartGroup.append("text")
    // this rotation makes things weird!
    // x and y placements will seem transposed.
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    // "em" used to offset the text. 1em is equivalent to 
    // the font size. For example, if default text is 16px, then 1 em is 16, 
    // 2 is 32px, etc. Used to dynamically place text regardless of size.
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "green")
    .text("Lacks Healthcare (%)"); 


}
  , function (error) {
    console.log(error);
  });
