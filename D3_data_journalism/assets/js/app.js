//Creating svg-area for future drawing of a scatter plot

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

//Creating svg
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Opening data
d3.csv("assets/data/data.csv").then(function (healthData) {

  //Parsing the data
  healthData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  //Creating variables for x- and y-values for using in tooltips text
  var name_x = "poverty";
  var name_y = "healthcare";
  
  //Creating initial scales
  var xPovertyScale = d3.scaleLinear()
    .domain(d3.extent(healthData, d => d.poverty))
    .range([0, width]);

  var yHealthScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  //Creating initial axes
  var xAxis = d3.axisBottom(xPovertyScale);
  var yAxis = d3.axisLeft(yHealthScale);

  //Appending initial axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x_axis") //adding class for future transition
    .call(xAxis);

  chartGroup.append("g")
    .attr("class", "y_axis") //adding class for future transition
    .call(yAxis);


  //Appending scatters
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthScale(d.healthcare))
    .attr("r", "14")
    .attr("fill", "green")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

  //Appending labels for scatters
  var circlesLabels = chartGroup.selectAll(null)
    .data(healthData)
    .enter()
    .append("g")
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xPovertyScale(d.poverty))
    .attr("y", d => yHealthScale(d.healthcare))
    .attr("font-size", "10px")
    .style("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("fill", "gold");

  //Creating tooltips
  var toolTip = d3.select("body")
    .append("div")
    .attr("class", "d3-tip");

  //Creating a function that shows tooltips
  function onMouseover(d, i) {
    console.log(name_x);
    toolTip.style("display", "block");
    toolTip.html(`<strong>${d.state} <br> ${name_x}: ${d[name_x]} <br> ${name_y}: ${d[name_y]}</strong>`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  }

  //Displaying initial tooltips
  circlesGroup.on("mouseover", onMouseover)
    .on("mouseout", function (d, i) {
      toolTip.style("display", "none");
    });

  //Creating function for a plot axis labels
  function createLabel() {
    return chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "green");

  }

  //Creating 6 axis labels (3 on each axes)
  // x-axis labels
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

  //Creating a function that updates x-axis and it`s values, including tooltips
  function updateX(a) {

    //change in opacity all x-labels
    d3.selectAll(".xaxis_label")
      .transition()
      .attr("opacity", 0.3);
    
    //change in opacity for an object label
    d3.select(a)
      .transition()
      .attr("opacity", 1);
    
    //checking on function
    console.log("works");

    // changing x-axis
    var xScale = d3.scaleLinear()
      .domain(d3.extent(healthData, d => d[name_x]))
      .range([0, width]);
    xAxis = d3.axisBottom(xScale);
    d3.selectAll(".x_axis")
      .transition()
      .duration(500)
      .call(xAxis);

    //changing scatters and its labels
    circlesGroup
      .transition()
      .duration(500)
      .attr("cx", d => xScale(d[name_x]));

    circlesLabels
      .transition()
      .duration(500)
      .attr("x", d => xScale(d[name_x]));

    //tooltips events
    circlesGroup.on("mouseover", onMouseover)
      .on("mouseout", function (d, i) {
        toolTip.style("display", "none");
      });
  }

  //Initialazing update function for each x-label
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


   //Creating a function that updates y-axis and it`s values, including tooltips
  function updateY(a) {

    //change in opacity all y-labels
    d3.selectAll(".yaxis_label")
      .transition()
      .attr("opacity", 0.3);

    //change in opacity for an object label
    d3.select(a)
      .transition()
      .attr("opacity", 1);

    //checking on function  
    console.log("works");

    // changing y-axis
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d[name_y])])
      .range([height, 0]);

    yAxis = d3.axisLeft(yScale);
    d3.selectAll(".y_axis")
      .transition()
      .duration(500)
      .call(yAxis);

    //changing scatters and its labels
    circlesGroup
      .transition()
      .duration(500)
      .attr("cy", d => yScale(d[name_y]));

    circlesLabels
      .transition()
      .duration(500)
      .attr("y", d => yScale(d[name_y]));

    //tooltips events  
    circlesGroup.on("mouseover", onMouseover)
      .on("mouseout", function (d, i) {
        toolTip.style("display", "none");
      });
  }

   //Initialazing update function for each y-label
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
