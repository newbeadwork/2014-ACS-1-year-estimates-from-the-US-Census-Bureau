// @TODO: YOUR CODE HERE!


//1

var svgArea = d3.select("body").select("svg");

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 80,
  right: 80,
  bottom: 80,
  left: 80
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
d3.csv("assets/data/data.csv").then(function (healthData) {
  console.log(healthData);

  // parsing the data
  healthData.forEach(function (data) {
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
  var yAxis = d3.axisLeft(yHealthcareScale);

  // appending axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x_axis")
    .call(xAxis);

  chartGroup.append("g")
    .attr("class", "y_axis")
    .call(yAxis);

//unction getData(healthdata)

  // appending circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthcareScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "green")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

  var circlesLabels = chartGroup.selectAll(null)
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

  var xLabelPoverty = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .text("In Poverty (%)");

  var xLabelAge = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .attr("opacity", 0.3)
    .text("Age (Median)");

  var xLabelIncome = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 70})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .attr("opacity", 0.3)
    .text("Household Income (Median)");

  // y-axis title
  var yLabelHealthcare = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 40)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "green")
    .text("Lacks Healthcare (%)");

  var yLabelHealthSmoke = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "green")
    .attr("opacity", 0.3)
    .text("Smokes (%)");

  var yLabelHealthcare = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "green")
    .attr("opacity", 0.3)
    .text("Obese (%)");

  xLabelAge.on("mouseover", function () {



    var xAgeScale = d3.scaleLinear()
      .domain(d3.extent(healthData, d => d.age))
      .range([0, width]);
    xAxis = d3.axisBottom(xAgeScale);
    d3.selectAll(".x_axis")
      .transition()
      .duration(3000)
      .call(xAxis);

    circlesGroup
      .transition()
      .attr("cx", d => xAgeScale(d.age));

    circlesLabels
      .transition()
      .text(d => d.abbr)
      .attr("x", d => xAgeScale(d.age));
      


  });

  /*.on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "green");
    });*/

}
  , function (error) {
    console.log(error);
  });
