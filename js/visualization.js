
var projection_outer
var svg_outer;

//loading the visualization after all external data has been collected
window.onload = function() {
//to bypass flag loading issue
country_flags();

}

//define the boundaries of the map
var legend_outer;
var width = window.innerWidth,
    height = window.innerHeight
var global_top;
var load_viz = function() {
d3.select("#map").selectAll("*").remove();

//set the earth projection from d3 geo library
var projection = d3.geoMercator()
.scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2])


//create the svg object for the map
var svg = d3.select("#map")
    .attr("width", 1000)
    .attr("height", 1000)
    .attr("class", "map");

svg_outer = svg

var path = d3.geoPath()
    .projection(projection)


projection_outer = projection

var g = svg.append("g")
    .attr("width", "1000")
    .attr("height", "1000")

// //create the tooltip for hovering
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip hidden");

sumba_coordinates = projection(sumba);

//function for making flag icons smaller in europe for clarity
//increase the size of the Sumba logo
var styleFlags = function(country) {
  // console.log(country);
  if(country.name==="Sumba Hospitality Foundation") {
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

//draw all flags on the map
  var draw_flags = function() {
              		g.selectAll("image")
              		 .data(trip_data)
            		   .enter()
              		 .append("svg:image")
              		 .attr("xlink:href", function(d) {
                     return d.flag
                   }) //ADD SUMBA LOGO and flags in coordinates
              		 .attr("x", function(d) {return projection([d.lon - 2, d.lat])[0];
                                  // console.log([d.lon, d.lat])
              		  })
              		 .attr("y", function(d) {
              				return projection([d.lon, d.lat])[1];
              		  })
              		 .attr("width", styleFlags)
                   .attr("height",styleFlags)
              		 .on("mousemove", showInfo)
                   .on("mouseout", hideInfo)

  }
// load and display the World
d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
  g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("d", path)
  	    .attr('fill', colorCountry)
        global_top = g

        // Color the appropriate country when the legend is hovered over
        //using jQuery to get the element of the legend itself to match countries within bounds
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
                var matching_countries = g.selectAll('path').filter(function(d) {
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

        //create  lines to Sumba to display guest flow from all over the world
        g.selectAll("myPath")
            .data(all_paths)
            .enter()
            .append("path")
              .attr("d", function(d){return path(d)})
              .attr('path', 5)
              .style("stroke", "blue")
              .style("stroke-opacity", 0.3)
              .style("fill", "none")
              .style("stroke-width", 1)
        //draw the flags after we have created everything else
        draw_flags();

   });


//count number of guests to create a simple chloropleth
var code_tocount = {}

  for (i of final_guests) {
    code_tocount['country_code'] = i['country_code']
  }

//color options of the chloropleth
var color_options = ['#abef95',"#8ae971", "#1fdb02","#268c16"];

//color the country based on its number of guests
function colorCountry(country) {
    var country_code = parseInt(country.id);
    var guests = country_to_guest_count[country_code]

  if(guests){

    if (1 <= guests && guests <= 10) {
      return color_options[0]
    }

    if (11 <= guests && guests < 20) {
      return color_options[1]

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


// hide the infobox
function hideInfo(d) {
  tooltip
  .classed('hidden', true);
}


// show name and guest count upon hover
function showInfo(d){
  var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
  		tooltip
	   .classed('hidden', false)
	   .html("<span id='close' onclick='hideInfo()'>x</span>" +
	   "<div class='inner_tooltip'>" +
	   			"<p>" + d.name + "</p>" +
        	 "</div><div>" + "Number of guests: " +
        		d.guests +
    			//
        	"</div>")
	   .attr('style',
			 'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')

};


}
