//zooming taken from https://www.knoyd.com/blog/2017/6/23/create-map-in-d3-part1


//to do:
//  - country labels
//  - color gradient for country based on guest count
//  - legend
//  - map centered around Sumba island

var width = window.innerWidth,
    height = window.innerHeight,
    centered,
    clicked_point;

var projection = d3.geoMercator()
    .translate([width / 2.2, height / 1.5]);

var plane_path = d3.geoPath()
    	.projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

var path = d3.geoPath()
    .projection(projection);


var g = svg.append("g");
//
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip hidden");

//this is for the legend that is to be impelented in sprint 2
var legend_cont = d3.select("body")
  					.append("div")
  					.attr("class", "legendContainer");
//
var legend  = d3.select(".legendContainer")
  				.append("ul")
  				.attr("class", "legend");

var tooltip_point = d3.select("body")
  	.append("div")
  	.attr("class", "tooltip_point hidden");



// load and display the World
d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, topology) {
  g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("click", clicked)
  	    .attr('fill', colorCountry)
        //create red lines to Sumba to display guest flow from all over the world
        g.selectAll("myPath")
            .data(all_paths)
            .enter()
            .append("path")
              .attr("d", function(d){return path(d)})
              .style("stroke", "red")
              .style("fill", "none")
              .style("stroke-width", 4)




   });


 // to color the countries of origin
function colorCountry(country) {
    if (visited_countries.includes(country.id)) {
            return '#c8b98d';
    } else {
        return '#e7d8ad';
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
    var temp = "<img class='legend_icon' title='ICON_TITLE' \
         src='ICON_LINK' alt='' width='50' height='50'> \
         ICON_KIND";
    temp = temp.replace("ICON_TITLE", d.name);
    temp = temp.replace("ICON_LINK", d.url);
    temp = temp.replace("ICON_KIND", d.name);
    return(temp);
};



var zoom = d3.zoom()
    .on("zoom",function() {
        var z = d3.event.transform;
        g.attr("transform", z);
        g.selectAll("path")
            .attr("d", path.projection(projection));

        g.selectAll("circle")
         .attr("r", width / 300 / z.k);
});

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
        if (key == "NoStory"){
            var this_img = "<p>Story coming soon...</p>" ;
            st = this_img
        } else {
          //add image link
            var this_img = "<a href='POST_LINK' target='_blank'><img class = 'icon' \
                       title='ICON_KIND' src='ICON_LINK' \
                       alt='' width='50' height='50' /></a>" ;
            this_img = this_img.replace("POST_LINK", posts["posts"][key]);
            this_img = this_img.replace("ICON_KIND", key);
            this_img = this_img.replace("ICON_LINK", icon_links[key]);
            st += this_img
        }
    });
    return st
}


// show location name on hover (still needs to be fixed)
function showTooltip(d){
  var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
  if (tooltip_point.classed("hidden")){
  		tooltip
	   .classed('hidden', false)
	   .html("<span id='close' onclick='hideTooltipPoint()'>x</span>" +
	   "<div class='inner_tooltip'>" +
	   			"<p>" + d.name + "</p>" +
        	 "</div><div>" +
        		getIconsAndLinks(d) +
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
        		getIconsAndLinks(d) +
    			//
        	"</div>")
  .attr('style',
        'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
};


//handle all clicking and zooming
function clicked(d) {
  console.log(d);
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
      	  } else {
            		x = width / 2;
            		y = height / 2;
            		k = 1;
      		      centered = null;
      		      // legend_cont.classed("hidden", false);
      	  }

      	  g.selectAll("path")
      	   .classed("active", centered && function(d) { return d === centered; })


      	  // make contours thinner before zoom
      	  if (centered !== null){
            		g.selectAll("path")
            		 .style("stroke-width", (0.75 / k) + "px");
          }

      	  // map transition
      	  g.transition()
            		//.style("stroke-width", (0.75 / k) + "px")
            		.duration(750)
            		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            		.on('end', function() {
                  			if (centered === null){
                  			  g.selectAll("path")
                  			   .style("stroke-width", (0.75 / k) + "px");
          }
          		  });

      	  // filter only points in the country
      	  var contained_points = trip_data.filter(function(point) {
          	  	if (point.country == d.id){
          	  		return true;
          	  	} else {
          	  		return false;
          	  	}
      	  });

      	  // remove all old points
      	  g.selectAll("image").remove()

      	  // if zooming in -> draw points
      	  if (centered !== null){
            		g.selectAll("image")
            		 .data(contained_points)
          		   .enter()
            		 .append("svg:image")
            		 .attr("xlink:href", "img/location1.png")
            		 .attr("x", function(d) {
                        				return projection([d.lon, d.lat])[0];
            		  })
            		 .attr("y", function(d) {
            				return projection([d.lon, d.lat])[1];
            		  })
            		 .attr("width", 30 / k + "px")
         .attr("height", 30 / k + "px")
            		 .on("mousemove", showTooltip)
                 .on("mouseout", hideTooltip)
            		 .on("click", showTooltipPoint)
          }
  } else {
            		hideTooltipPoint(d);
  }


}
