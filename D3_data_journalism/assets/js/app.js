

var svgArea = d3.select("body").select("svg");

var svgWidth = 960;
var svgHeight = 900;

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
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });
 var name_x = "poverty";
 var name_y = "healthcare";
  // creating scales

  var xPovertyScale = d3.scaleLinear()
    .domain(d3.extent(healthData, d => d.poverty))
    .range([0, width]);

  var yHealthScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  // creating axes
  var xAxis = d3.axisBottom(xPovertyScale);
  var yAxis = d3.axisLeft(yHealthScale);

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
    .attr("cy", d => yHealthScale(d.healthcare))
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
    .attr("y", d => yHealthScale(d.healthcare))
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("fill", "gold");

  var toolTip = d3.select("body")
    .append("div")
    .attr("class", "d3-tip");

    function onMouseover(d, i) {
      console.log(name_x);
      //toolTip.style("display", "block");
      toolTip.html(`${d.state} <br> ${name_x}: ${d[name_x]} <br> ${name_y}: ${d[name_y]}`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    }

    circlesGroup.on("mouseover", onMouseover);
  //`${d.state} <br> poverty: ${d.poverty} <br> lack of healthcare: ${d.healthcare}`

  function createLabel() {
    return chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "green");

  }

  var xLabelPoverty = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .attr("class", "xaxis_label")
    .attr("opacity", 1)
    .text("In Poverty (%)");

  var xLabelAge = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 50})`)
    .attr("class", "xaxis_label")
    .attr("opacity", 0.3)
    .text("Age (Median)");

  var xLabelIncome = createLabel()
    .attr("transform", `translate(${width / 2}, ${height + 70})`)
    .attr("class", "xaxis_label")
    .attr("opacity", 0.3)
    .text("Household Income (Median), $");

  // y-axis title
  var yLabelHealthcare = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("class", "yaxis_label")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 40)
    .attr("dy", "1em")
    .attr("opacity", 1)
    .text("Lacks Healthcare (%)");

  var yLabelSmoke = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("class", "yaxis_label")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .attr("opacity", 0.3)
    .text("Smokes (%)");

  var yLabelObese = createLabel()
    .attr("transform", "rotate(-90)")
    .attr("class", "yaxis_label")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .attr("opacity", 0.3)
    .text("Obese (%)");


  function updateX(a) {

    d3.selectAll(".xaxis_label")
      .transition()
      .attr("opacity", 0.3);

    d3.select(a)
      .transition()
      .attr("opacity", 1);

    console.log("works");

    var xScale = d3.scaleLinear()
      .domain(d3.extent(healthData, d => d[name_x]))
      .range([0, width]);
    xAxis = d3.axisBottom(xScale);
    d3.selectAll(".x_axis")
      .transition()
      .duration(500)
      .call(xAxis);

    circlesGroup
      .transition()
      .duration(500)
      .attr("cx", d => xScale(d[name_x]));

    circlesLabels
      .transition()
      .duration(500)
      .attr("x", d => xScale(d[name_x]));

      
    circlesGroup.on("mouseover", onMouseover);
  }


  xLabelPoverty.on("click", function () {
    name_x = "poverty";
    updateX(this)
  });

  xLabelAge.on("click", function () {
    name_x = "age";
    updateX(this)
  });
  xLabelIncome.on("click", function () {
    name_x = "income";
    updateX(this)
  });


  function updateY(a) {
    d3.selectAll(".yaxis_label")
      .transition()
      .attr("opacity", 0.3);

    d3.select(a)
      .transition()
      .attr("opacity", 1);

    console.log("works");


    var yScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d[name_y])])
      .range([height, 0]);

    yAxis = d3.axisLeft(yScale);
    d3.selectAll(".y_axis")
      .transition()
      .duration(500)
      .call(yAxis);

    circlesGroup
      .transition()
      .duration(500)
      .attr("cy", d => yScale(d[name_y]));

    circlesLabels
      .transition()
      .duration(500)
      .attr("y", d => yScale(d[name_y]));

    circlesGroup.on("mouseover", onMouseover);
  }

  yLabelHealthcare.on("click", function () {
    name_y = "healthcare";
    updateY(this)
  });

  yLabelSmoke.on("click", function () {
    name_y = "smokes";
    updateY(this)
  });

  yLabelObese.on("click", function () {
    name_y = "obesity";
    updateY(this)
  });

}
  , function (error) {
    console.log(error);
  });
