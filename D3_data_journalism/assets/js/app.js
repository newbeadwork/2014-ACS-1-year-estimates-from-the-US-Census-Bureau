

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
     .attr("class", "axis_label")
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

  var yLabelSmoke = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .text("Smokes (%)");

  var yLabelObese = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .text("Obese (%)");

  function updateX(a, name) {

    d3.selectAll(".axis_label")
      .transition()
      .attr("opacity", 0.3);

    d3.select(a)
      .transition()
      .attr("opacity", 1);

    console.log("works");

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

  /*function Click() {
    d3.select(this)
    .transition()
    .attr("opacity", 1);
  }*/

 /* function updateThis(a) {

    d3.select(a)
      .transition()
      .attr("opacity", 1);    
  }*/
  
  xLabelPoverty.on("click", function () {
    updateX(this, "poverty")
  });
  xLabelAge.on("click", function () {
    updateX(this, "age")
  });
  xLabelIncome.on("click", function () {
    updateX(this, "income")
  });
  
  
    /* .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });

  xLabelAge.on("click", function () {
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

  xLabelIncome.on("click", function () {
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

  function updateY(name) {

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d[name])])
      .range([height, 0]);

    yAxis = d3.axisLeft(yScale);
    d3.selectAll(".y_axis")
      .transition()
      .duration(500)
      .call(yAxis);

    circlesGroup
      .transition()
      .duration(500)
      .attr("cy", d => yScale(d[name]));

    circlesLabels
      .transition()
      .duration(500)
      .attr("y", d => yScale(d[name]));
  }
  
  
  yLabelHealthcare.on("click", function () {
    d3.select(this)
      .transition()
      .attr("opacity", 1);
    updateY("healthcare")
  })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });
  
    yLabelSmoke.on("click", function () {
    d3.select(this)
      .transition()
      .attr("opacity", 1);
    updateY("smokes")
  })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });

  yLabelObese.on("click", function () {
    d3.select(this)
      .transition()
      .attr("opacity", 1);
    updateY("obesity")
  })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .attr("opacity", 0.3);
    });*/

  

}
  , function (error) {
    console.log(error);
  });
