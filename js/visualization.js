
var projection_outer
var svg_outer;
window.onload = function() {
country_flags();

}
var legend_outer;
var width = window.innerWidth,
    height = window.innerHeight - 20,
    centered,
    clicked_point;
var scale = 100
var translate_width = width / 2
var global_top;
var translate_height = height / 2
var load_viz = function() {
d3.select("#map").selectAll("*").remove();
//to do:
//  - country labels
//  - color gradient for country based on guest count
//  - legend
//  - map centered around Sumba island



var projection = d3.geoMercator()



var svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

svg_outer = svg

var path = d3.geoPath()
    .projection(projection)

    // var quantize = d3.scaleQuantize()
    //   .domain([ 0, 150 ])
    //   .range(d3.range(3).map(function(i) { return i; }));


projection_outer = projection

var plane_path = d3.geoPath()
    	.projection(projection);

var g = svg.append("g")
    .attr("width", "1000")
    .attr("height", "1000")


    //returns the range of guest values



    // svg.append("g")
    //   .attr("class", "legendQuant")
    //   .attr("transform", "translate(20,200)");

    // var legend = d3.legendColor()
    //   .labelFormat(d3.format("d"))
    //   .useClass(true)
    //   .title("Legend")
    //   .titleWidth(100)
  //   //   // .scale(quantize);
  //
  //     legend_outer = legend;
  //
  //     svg.select(".legendQuant")
  // .call(legend);


//
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip hidden");

//this is for the legend that is to be impelented in sprint 2

//
// var legend  = d3.select(".legendContainer")
//   				.append("ul")
//   				.attr("class", "legend");

          //add list item for every category




var tooltip_point = d3.select("body")
  	.append("div")
  	.attr("class", "tooltip_point hidden");

// for
//
//var extent = d3.extent(guest_scale);
//

sumba_coordinates = projection(sumba);


// svg.append("image")
//             .attr("x", sumba_coordinates[0])
//             .attr("y", sumba_coordinates[1])
//             .attr("width", 20)
//             .attr("height", 20)
//             .style("border-radius", "50%")
//             .attr("href", "images/sumba.png");

var styleFlags = function(country) {
  // console.log(country);
  if(country.name=="Sumba") {
    return 40 + "px";
  }

  if ((-5 <= country.lon && country.lon <= 20)
  && (40 <= country.lat && country.lat <= 62)) {

    return 10 + "px";
  }

  else {
      return 20 + "px";
  }

}

            var draw_flags = function() {
                  	  // if zooming in -> draw points
                  	  //if (centered !== null){
                        		g.selectAll("image")
                        		 .data(trip_data)
                      		   .enter()
                        		 .append("svg:image")
                        		 .attr("xlink:href", function(d) {
                               return d.flag
                               // console.log(d.flag)
                             }) //ADD SUMBA LOGO
                        		 .attr("x", function(d) {
                                    				return projection([d.lon - 2, d.lat])[0];
                                            // console.log([d.lon, d.lat])
                        		  })
                        		 .attr("y", function(d) {
                        				return projection([d.lon, d.lat])[1];
                        		  })


                        		 .attr("width", styleFlags)
                               // console.log(d);
                               // if(d.name=="Sumba") {
                               //   return 40 + "px";
                               // }
                               // if ((-5 <= d.lon && d.lon <= 20)
                               // && (40 <= d.lat && d.lat <= 62)) {
                               //   console.log(d);
                               //   console.log("THis countRy matCHES");
                               //   return 10 + "px";
                               // }
                               // return 20 + "px";

                             .attr("height",styleFlags)
                        		 .on("mousemove", showTooltip)
                             .on("mouseout", hideTooltip)
                        		 ///.on("click", showTooltipPoint)
                      //}


            }
// load and display the World
d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
  g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("click", clicked)
  	    .attr('fill', colorCountry)

        global_top = g

        // Color the country when the legend is highligted
          $(".legend-labels").children().each(function() {
              var selectedLegendRangeElement = $(this);

              var lower_bound = parseInt(selectedLegendRangeElement.attr("from"))
              var upper_bound = parseInt(selectedLegendRangeElement.attr("to"))

              var matching_country_codes = [];
              for (country in country_to_guest_count) {

                const guest_count = country_to_guest_count[country];
                if (guest_count >= lower_bound && guest_count <= upper_bound) {
                  matching_country_codes.push(parseInt(country));
                  console.log(matching_country_codes)
                }

              }

              selectedLegendRangeElement.mouseover(function(d) {
                //var people_bounds = d.target.innerHTML.split(" to ");
                var matching_countries = g.selectAll('path').filter(function(d) {
                  // console.log(parseInt(d.id));
                  // console.log(parseInt(matching_country_codes));
                  return d.type==="Feature" && matching_country_codes.includes(parseInt(d.id))


                });
                matching_countries.style('fill', 'blue')

              })

              selectedLegendRangeElement.mouseleave(function(d) {
                  g.selectAll('path').filter(function(d) {
                    return d.type==="Feature" && matching_country_codes.includes(parseInt(d.id));
                  }).style('fill', colorCountry)
              })

          })
        // .attr('fill',function(d,i) { return color(i); });
        // set the color of each country

        //create red lines to Sumba to display guest flow from all over the world
        g.selectAll("myPath")
            .data(all_paths)
            .enter()
            .append("path")
              .attr("d", function(d){return path(d)})
              // .transition()
              //   		//.style("stroke-width", (0.75 / k) + "px")
              //   		.duration(750)
              //   		.attr("transform", 2000)
              .attr('path', 5)
              .style("stroke", "blue")
              .style("stroke-opacity", 0.3)
              .style("fill", "none")
              .style("stroke-width", 1)

        draw_flags();

   });

 var visited_countries = ["360", "056", "840", "276", "528",
 						 "250","724", "036", "124", "458",
 						 "826", "104", "752", "031", "156",
 						 "356", "380", "348", "410", "442",
 						 "554", "702", "756", "376", "364",
             "076", "616"];



var code_tocount = {}

// console.log(final_guests)

  for (i of final_guests) {
    code_tocount['country_code'] = i['country_code']
    // console.log('hi')
  }


var color_options = ['#abef95',"#8ae971", "#1fdb02","#268c16"];


function colorCountry(country) {
    var country_code = parseInt(country.id);
    var guests = country_to_guest_count[country_code]

  if(guests){

    if (1 <= guests && guests <= 10) {
      return color_options[0]
    }

    if (11 <= guests && guests < 20) {
      return color_options[1]
      // console.log(guests)

    }

    if (21 <= guests && guests < 30) {
      return color_options[2]
      // console.log(guests)
    }

      if (guests => 30) {
        return color_options[3]
    }
  }
  else {
      return '#c88925';
  }

};

//this will be used in sprint 2...
// color countries for particular legend item

function colorCountriesCategory(d){
    //filter relevant countries using hasContent function
    var these_countries = trip_data.filter(function(s){
                                                return hasContent(s, d.name);
                                            });
    var active_countries =  these_countries.map(function(a) {return a.country;});
    var unique = active_countries.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    //color countries
    g.selectAll('path')
     .attr('fill', function(t){
        return colorCountryLegend(t, unique);
     });

};


	g.selectAll('path')
	 .attr('fill', function(t){
	 	return colorCountryLegend(t, unique);
	 });


// color country according to legend
function colorCountryLegend(country, active_countries) {
    if (active_countries.includes(country.id)) {
        return '#f56260';
    } else if (visited_countries.includes(country.id)) {
        return '#c8b98d';
    } else {
    	return '#e7d8ad';
    }
};


function hasContent(s, kind){

	var post_keys = Object.keys(s.posts);
    // console.log(post_keys.includes(kind));
	return post_keys.includes(kind)
};

// get legend items
function getLegend(d){
    var temp = "placeholder";
    temp = temp.replace("ICON_TITLE", d.name);
    temp = temp.replace("ICON_LINK", d.url);
    temp = temp.replace("ICON_KIND", d.name);
    return(temp);
};


// var zoom = d3.zoom()
//     .on("zoom",function() {
//         var z = d3.event.transform;
//         g.attr("transform", z);
//         g.selectAll("path")
//             .attr("d", path.projection(projection));
//
//         g.selectAll("circle")
//          .attr("r", width / 100 / z.k);
// });

// // show country id on hover
function showTooltipCountry(d){
  var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
  tooltip
  .classed('hidden', false)
  .html(d.id)
  .attr('style',
        'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
};

// hide tooltip
function hideTooltip(d) {
  // Show the tooltip (unhide it) and set the name of the data entry.
  tooltip
  .classed('hidden', true);
}
//
// hide point tooltip
function hideTooltipPoint(d) {
  // Show the tooltip (unhide it) and set the name of the data entry.
  tooltip_point
  .classed('hidden', true);
}


// get icons to interact with link for more information regarding guests and country data
function getIconsAndLinks(posts){
    keys = Object.keys(posts["posts"]) //get available content
    var st = "";

    keys.forEach(function(key, index){
        //if not story
        if (key == "No Story"){
            var this_img = "<p>Story coming soon...</p>" ;
            st = this_img
        }
        // else {
        //   //add image link
        //     var this_img = "<a href='POST_LINK' target='_blank'><img class = 'icon' \
        //                title='ICON_KIND' src='ICON_LINK' \
        //                alt='' width='50' height='50' /></a>" ;
        //     this_img = this_img.replace("POST_LINK", posts["posts"][key]);
        //     this_img = this_img.replace("ICON_KIND", key);
        //     this_img = this_img.replace("ICON_LINK", icon_links[key]);
        //     st += this_img
        // }
    });
    return st
}


// show location name on hover (still needs to be fixed)
function showTooltip(d){
  // console.log(d)
  var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
  if (tooltip_point.classed("hidden")){
  		tooltip
	   .classed('hidden', false)
	   .html("<span id='close' onclick='hideTooltipPoint()'>x</span>" +
	   "<div class='inner_tooltip'>" +
	   			"<p>" + d.name + "</p>" +
        	 "</div><div>" + "Number of guests: " +
        		d.guests +
    			//
        	"</div>")
	   .attr('style',
			 'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
  };

};

// show point tooltip
function showTooltipPoint(d){
  var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
  tooltip_point
  .classed('hidden', false)
  .html("<span id='close' onclick='hideTooltipPoint()'>x</span>" +
	   "<div class='inner_tooltip'>" +
	   			"<p>" + d.name + "</p>" +
        	 "</div><div>" +
        		// getIconsAndLinks(d) +
    			//
        	"</div>")
  .attr('style',
        'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
};


//handle all clicking and zooming
function clicked(d) {}
  // console.log(d);
  var d = 5
  if (tooltip_point.classed("hidden")){
      	  var x, y, k;

      	  if ((d && centered !== d) & (visited_countries.includes(d.id))) {
          	  	g.selectAll('path')
          	 	  .attr('fill', colorCountry);

            		var centroid = path.centroid(d);
            		var bounds = path.bounds(d);
            		var dx = bounds[1][0] - bounds[0][0],
      			            dy = bounds[1][1] - bounds[0][1];

      		      // legend_cont.classed("hidden", true);
            		x = (bounds[0][0] + bounds[1][0]) / 2;
            		y = (bounds[0][1] + bounds[1][1]) / 2;
            		k = Math.min(width / dx, height / dy);
            		centered = d;
      	  }
           else {
            		x = width / 2;
            		y = height / 2;
            		k = 1;
      		      centered = null;
      		      //legend_cont.classed("hidden", false);
      	  }

      	  g.selectAll("path")
      	   .classed("active", centered && function(d) { return d === centered; })


      	  // make contours thinner before zoom


      	  // map transition
      	  // g.transition()
          //   		//.style("stroke-width", (0.75 / k) + "px")
          //   		.duration(750)
          //   		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          //   		.on('end', function() {
          //         			if (centered === null){
          //         			  g.selectAll("path")
          //         			   .style("stroke-width", (0.75 / k) + "px");
          // }
          // 		  });

      	  // remove all old points
      	  g.selectAll("image").remove()

}




}
