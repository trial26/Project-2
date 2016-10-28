(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 550 - margin.top - margin.bottom,
    width = 770 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint().domain(['Before 1930s','1930-39','1940-49','1950-59','1960-69','1970-79','1980-89','1990-99','2000-09','2010-19']).range([0, width]).padding(2);
  // var yPositionScale = d3.scaleLinear().domain([0,850]).range([height, 0]);
  var yPositionScale = d3.scaleLinear().range([height, 0]);
  var colorScale = d3.scaleLinear().domain([3.6,4.5]).range(['blue','red']);
  var radiusScale = d3.scaleSqrt().domain([17000,4500000]).range([6,32]);


  d3.queue()
    .defer(d3.csv, "scifi_top100.csv")
    .await(ready)

  function ready(error, datapoints) {

    var sorted = datapoints.sort(function(a,b){
      return b.no_ratings - a.no_ratings;
    });

    var max = d3.max(datapoints,function(d){return +d.votes});
    yPositionScale.domain([0,max]);

  drawCircles();

  // function for drawing circles

  function drawCircles(){

    svg.selectAll("circle")
    .remove();

    svg.selectAll("circle")
      .data(sorted)
      .enter().append("circle")
      .attr("class","book")
      .attr("r", 6)
      .attr("cx", function(d) {
        return xPositionScale(d.decade)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.votes)
      })
      .attr("fill", function(d){
        return colorScale(d.avg_rating)
      })
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .on('mouseover', function(d) {
	       d3.select(this).attr("fill","yellow");
         d3.select('#bookname').text(d.book_name);
         d3.select('#author').text(d.author_name);
         d3.select('#score').text(d.score);
         d3.select('#rating').text(d.avg_rating);
        //  d3.select('#country-display').style("display","block");
       })
      .on('mouseout',function(d){
         d3.select(this).attr("fill",function(d){
           return colorScale(d.avg_rating);
         });
         d3.select('#selected').text("");
         d3.select('#bookname').text("-");
         d3.select('#author').text("-");
         d3.select('#score').text("-");
         d3.select('#rating').text("-");
        //  d3.select('#country-display').style("display","none");

       })


     }
//code for drawing axes
     var xAxis = d3.axisBottom(xPositionScale);
     svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis);

     svg.append("text")
     .attr("x",width/2)
     .attr("y",height+45)
     .style("text-anchor", "end")
     .text("Years")


     var yAxis = d3.axisLeft(yPositionScale);
     svg.append("g")
       .attr("class", "y-axis")
       .call(yAxis)

     svg.append("text")
       .attr("class","justtext")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Number of votes");


// code to show all books
      d3.select('#all')
       .on('click',function(d){

       var max = d3.max(datapoints,function(d){return +d.votes});
       yPositionScale.domain([0,max]);

      d3.selectAll("circle")
       .transition().duration(750)
       .attr("cx", function(d){
         return xPositionScale (d.decade);
       })
       .attr("cy",function(d){
         return yPositionScale(+d.votes);
       })
       .attr("opacity",1)
       .attr("stroke-width",1);


       svg.selectAll(".y-axis")
       .transition().duration(800)
       .call(yAxis);

     });

//code to show books with hugo award
      d3.select('#hugo')
       .on('click',function(d){

     var max = d3.max(datapoints,function(d){return +d.votes});
     yPositionScale.domain([0,max]);

      d3.selectAll("circle")
      .transition().duration(750)
      .attr("cx", function(d){
        return xPositionScale (d.decade);
      })
      .attr("cy",function(d){
        return yPositionScale(+d.votes);
      })
       .attr("opacity",function(d){
          if (d.hugo_won ==1){return 1}
          else {return 0.1};
       })
       .attr("stroke-width", function(d){
         if(d.hugo_won == 1){return 5}
         else { return 1 };
       });

       svg.selectAll(".y-axis")
       .transition().duration(800)
       .call(yAxis);

     });

//code to show books that have won nebula award
     d3.select('#nebula')
      .on('click',function(d){

        var max = d3.max(datapoints,function(d){return +d.votes});
        yPositionScale.domain([0,max]);

         d3.selectAll("circle")
         .transition().duration(750)
         .attr("cx", function(d){
           return xPositionScale (d.decade);
         })
         .attr("cy",function(d){
           return yPositionScale(+d.votes);
         })
          .attr("opacity",function(d){
             if (d.nebula_won ==1){return 1}
             else {return 0.1};
          })
          .attr("stroke-width", function(d){
            if(d.hugo_won == 1){return 5}
            else { return 1 };
          });

          svg.selectAll(".y-axis")
          .transition().duration(800)
          .call(yAxis);

    });

//code to show books by no. of votes
    d3.select('#first')
    .on('click',function(d){
      turn(0,250)});

    d3.select('#second')
    .on('click',function(d){
      turn(250,500)});

    d3.select('#third')
    .on('click',function(d){turn(500,750)});

    d3.select('#fourth')
    .on('click',function(d){turn(750,1000)});

    function turn (min,max){

    var newpoints = datapoints.filter( function(d) {
    	return +d.votes >=min & +d.votes<max;
    });

    var max1 = d3.max(newpoints,function(d){return +d.votes});
    console.log(max1);
    yPositionScale.domain([0,max1]);


    d3.selectAll("circle")
    .transition().duration(750)
    .attr("stroke-width",1)
    .attr("opacity",  function(d){
     if (+d.votes >=min & +d.votes<max){return 1}
      else {return 0};
    })
    .attr("cx",function(d){return xPositionScale(d.decade);})
    .attr("cy",function(d){

      if (+d.votes >=min & +d.votes<max)
        {return yPositionScale(+d.votes);}
        else {return 0;}

    });

    svg.select(".y-axis")
    .transition()
    .call(yAxis);
}

//code to show books by score
    d3.select('#a')
    .on('click',function(d){
      turn_score(0,10000)});

    d3.select('#b')
    .on('click',function(d){
      turn_score(10000,20000)});

    d3.select('#c')
    .on('click',function(d){
      turn_score(20000,30000)});

    d3.select('#d')
      .on('click',function(d){
        turn_score(30000,40000)});

    d3.select('#e')
        .on('click',function(d){
          turn_score(40000,90000)});


    function turn_score (min,max){

    // var newpoints = datapoints.filter( function(d) {
    // 	return +d.votes >=min & +d.votes<max;
    // });
    //
    // var max = d3.max(newpoints,function(d){return +d.votes});
    // yPositionScale.domain([0,max]);
    //
    // svg.select(".y-axis")
    // .transition()
    // .call(yPositionScale)
    //
    // drawCircles();

    d3.selectAll("circle")
    .transition().duration(750)
    .attr("stroke-width",1)
    .attr("opacity",  function(d){
     if (+d.score >=min & +d.score<max){return 1}
      else {return 0.1};
    })
    .transition()
    .duration(200);
}


//code to show ratings with checkbox
    d3.select("#toggle_button").on('change', function(d) {

      console.log("in here");
    	if(this.checked) {
    		console.log('The value of this checkbox was');
     		console.log(this.value);

        d3.selectAll("circle")
        .transition().duration(750)
        .attr("r", function(d){
          return radiusScale(+d.no_ratings);
        })
    	}

      else {
        d3.selectAll("circle")
        .transition().duration(750)
        .attr("r",6);
    }
    });


//hhhh


d3.selectAll('input[name="options"]').on('change', function() {
	console.log("radio buttons were changed");
  var val = d3.select('input[name="options"]:checked').property("value");
  console.log(val);

});


//to draw axes






  }

  //end of function ready
})();
