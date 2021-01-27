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
  value = healthData.map(d => d.values);
  console.log(value);
  console.log(d3.keys(healthData));
  console.log(d3.values(healthData));
    console.log(healthData.columns);
    


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

  function createLabel () {
     return chartGroup.append("text")
     .attr("text-anchor", "middle")
     .attr("font-size", "16px")
     .attr("fill", "green")
     .attr("opacity", 0.3);
    }
  
  var xLabelPoverty = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .text("In Poverty (%)");

  var xLabelAge = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 50})`)
    .text("Age (Median)");

  var xLabelIncome = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 70})`)
    .text("Household Income (Median), $");

  // y-axis title
  var yLabelHealthcare = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 40)
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

  var yLabelHealthSmoke = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .text("Smokes (%)");

  var yLabelHealthcare = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .text("Obese (%)");

    function updateX(name) {
      console.log(d3.extent(healthData, d => d.age));

      
      var xScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d[name]))
        .range([0, width]);
      xAxis = d3.axisBottom(xScale);
      d3.selectAll(".x_axis")
        .transition()
        .duration(500)
        .call(xAxis);
  
      circlesGroup
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d[name]));
  
      circlesLabels
        .transition()
        .duration(500)
        .attr("x", d => xScale(d[name]));
    }
  
  xLabelAge.on("mouseover", function () {
    d3.select(this)
      .transition()
      .attr("opacity", 1);
    updateX("age")
  })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });

  xLabelIncome.on("mouseover", function () {
    d3.select(this)
      .transition()
      .attr("opacity", 1);
    updateX("income")
  })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });
}
  , function (error) {
    console.log(error);
  });
