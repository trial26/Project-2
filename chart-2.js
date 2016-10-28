(function() {
  var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 770 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  // We'll set the domain once we've read in
  // the data
  var xPositionScale = d3.scalePoint().domain(['Before 1930s','1930-39','1940-49','1950-59','1960-69','1970-79','1980-89','1990-99','2000-09','2010-19'])
  .range([0, width]).padding(2);

  var yPositionScale = d3.scaleLinear()
    .range([height, 0]);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Count:</strong> <span style='color:red'>" + d.count + "</span>";
    })

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  d3.queue()
    .defer(d3.csv, "scifi_count.csv")
    .await(ready)

  function ready(error, datapoints) {

    var countMax = d3.max(datapoints, function(d) { return +d.count; })
    yPositionScale.domain([0, countMax]);

    svg.selectAll(".bar")
        .data(datapoints)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xPositionScale(d.decade)-18;
        })
        .attr("y", function(d) {
          return yPositionScale(+d.count);
        })
        .attr("width", 36)
        .attr("height", function(d) {
          return height - yPositionScale(+d.count);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    // Set up our x axis
    var xAxis = d3.axisBottom(xPositionScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
    .attr("x",width/2)
    .attr("y",height+45)
    .style("text-anchor", "end")
    .text("Years");

    // set up our y axis
    var yAxis = d3.axisLeft(yPositionScale);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

  };

})();
