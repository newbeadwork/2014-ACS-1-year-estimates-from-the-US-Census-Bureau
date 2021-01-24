// @TODO: YOUR CODE HERE!


//1

var svgArea = d3.select("body").select("svg");

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

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

  // line generator
  var line = d3.line()
    .x(d => xPovertyScale(d.poverty))
    .y(d => yHealthcareScale(d.healthcare));

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthcareScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black");
    
    
});
