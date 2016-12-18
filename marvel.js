(function() {

    var margin = { top: 50, left: 50, right: 10, bottom: 50},
    height = 800 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


    var outerRadius = 600 * 0.5 - 40
        ,innerRadius = outerRadius - 30;

    var svg = d3.select("#marvel")
          .append("svg")
          .attr("height", height + margin.top + margin.bottom)
          .attr("width", width + margin.left + margin.right);


    d3.queue()
      .defer(d3.csv, "marvel2.csv")
      .await(ready)

    function ready(error, datapoints) {

  //turn data into table
  var data = [];

  datapoints.forEach(function(d){data.push([d.char1,d.char2,+d.correlation])});


  var colors = {
   "Black Widow":"#301E1E"
  ,"Captain America":"#083E77"
  ,"Hawkeye":"#342350"
  ,"Hulk":"#567235"
  ,"Iron Man":"#8B161C"
  ,"Thor":"#DF7C00"
};

  var ch = viz.ch().data(data).padding(.05)
  	  	  .innerRadius(innerRadius)
  	  	  .outerRadius(outerRadius)
  	  	  .startAngle(1.5*Math.PI)
  	  	  .fill(function(d){ return colors[d];})

          .chordOpacity(0.7)
          .labelPadding(.04)


    svg.append("g")
      .attr("transform", "translate("+width/2+","+height/2+")")
      .call(ch);

  d3.select(self.frameElement).style("height", height+"px").style("width", width+"px");
}


})();
