var svgArea = d3.select("body").select("svg");

if (!svgArea.empty()) {
  svgArea.remove();
}
// svg params
var svgHeight = window.innerHeight;
var svgWidth = window.innerWidth;

    // margins
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Pull Data and put into chart
d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);

    var state = data.map(data => data.state);
    var abr = data.map(data => data.abbr);
    //var poverty = data.map(data => data.poverty);
    //var healthcare = data.map(data => data.healthcare);
    var smoker = data.map(data => data.smokes);
    //var age = data.map(data => data.age);
    var income = data.map(data => data.income);

    console.log("states", state);
    console.log("abreviations", abr);
    //console.log("Poverty Rates", poverty);
    //console.log("Healthcare", healthcare);
    console.log("Smoker Numbers", smoker);
    //console.log("Age", age);
    console.log("Income", income);

    data.forEach(function(data) {
        data.smokes = +data.smokes;
        data.income = +data.income;
    });

    //Linear Scale
    var xmin = d3.min(data, d => d.income);
    var xmax = d3.max(data, d => d.income);
    var ymin = d3.min(data, d => d.smokes);
    var ymax = d3.max(data, d => d.smokes);

    var xLinearScale = d3.scaleLinear()
      .domain([(xmin - 5000), (xmax + 5000)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([(ymin - 10), (ymax +10)])
      .range([chartHeight, 0]);

    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    //State Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "#325383")
        .attr("opacity", ".9")

    

    //Axes Labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", -80 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of Population that Smokes");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, 670)`)
      .attr("class", "axisText")
      .text("Median Income of State Population");

    //tooltip mouseover
    var toolTip = d3.select("body")
        .append("div")
        .classed("tooltip", true);

    circlesGroup.on("mouseover", function(d) {
      console.log("Mouse on detected")
      toolTip.style("display", "block")
          .html(
            `<strong>${d.state}<strong>`);
          //.style("left", d3.event.pageX + "px")
          //.style("top", d3.event.pageY + "px");
    })
      .on("mouseout", function() {
        console.log("Mouseout detected");
        toolTip.style("display", "nine");
      });

}).catch(function(error) {
    console.log(error);
});