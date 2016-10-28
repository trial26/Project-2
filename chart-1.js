(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 350 - margin.top - margin.bottom,
    width = 770 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var colorScale = d3.scaleOrdinal().range([ '#e6550d', '#fdae6b', '#fee6ce'])

    var radius = 120;

    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(80);

    var labelArc = d3.arc()
        .outerRadius(radius + 15)
        .innerRadius(radius + 15);

    var pie = d3.pie()
      .value(function(d) {
        return d.count;
      })
      .sort(null);

    d3.queue()
      .defer(d3.csv, "award_count.csv")
      .await(ready)

    function ready(error, datapoints) {
      pieHolder = svg.append("g").attr("transform", "translate(325,120)");

    pie_score('All');

      d3.select('#f')
      .on('click',function(d){
        pie_score('All')});

      d3.select('#g')
      .on('click',function(d){
        pie_score('1950-59')});

      d3.select('#h')
      .on('click',function(d){
        pie_score('1960-69')});

      d3.select('#i')
      .on('click',function(d){
        pie_score('1970-79')});

      d3.select('#j')
      .on('click',function(d){
        pie_score('1980-89')});

      d3.select('#k')
      .on('click',function(d){
        pie_score('1990-99')});



function pie_score(range)

{

    var mine = datapoints.filter(function(d){
      return d.decade == range;
    });

    var g = pieHolder.selectAll(".arc")
          .data(pie(mine))
          .enter().append("g");

       g.append("path")
          .attr("d", arc)
          .attr("fill", function(d) {
            // you need to use d.data
            return colorScale(d.data.award);
          })

      svg.selectAll(".label").remove();

      g.append("text")
        .attr("class","label")
        .attr("transform", function(d) {
          return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("text-anchor", function(d) {
          if(d.startAngle + d.endAngle / 2 < Math.PI) {
            return 'start';
          } else {
            return 'end';
          }
        })
        .style("font-size","15px")
        .text(function(d) {
          return "" + d.data.award + ": " + d.data.count;
        });

}

  }
})();
