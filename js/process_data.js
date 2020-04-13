//initiate the array with the Sumba dictionary
var trip_data = [{"lat" : -9.6993,
"lon" : 119.9741,
"name" : "Sumba Hospitality Foundation",
country_code : 360,
"flag" : "images/sumba.png",
"guests" : 331,
"posts" : {
  "NoStory" : ""
}}]

var final_guests = []
var country_toCode = {}
var country_toCoord = {}
var country_toFlag= {}

var country_flags_loaded = false;


// to import flags
var country_flags = function() { d3.tsv("https://raw.githubusercontent.com/euctrl-pru/dashboard/master/data/world-country-flags.tsv").row(function(row) {
  country_toFlag[parseInt(row["id"])] = row["url"]
  row.close = +row.close;
}).get(function() {
  country_codes();
  country_flags_loaded = true;
})};


//to bypass concurrency issues from loading data
var country_codes_loaded = false;

//load the country code dataset
var country_codes = function() { d3.csv("/data/country_codes.csv").row(function(row) {
  country_toCode[row["name"]] = [parseInt(row["country-code"])]

  row.close = +row.close;
}).get(function() {
  geoCoord_data();
  country_codes_loaded = true;
})};

var geo_cords_loaded = false;
var geoCoord_data = function() {
  d3.csv("/data/geocoordinates.csv").row(function(row) {
  country_toCoord[row["Country"]] = [row["Longitude"], row['Latitude']]
  row.close = +row.close;
}).get(function() {

  geo_cords_loaded = true;
  guest_data();

});
};

var all_paths = []

var country_to_guest_count = {}

var all_done = false;
//initiate the final data load: importing the data of the guests given to us by partner org
var guest_data = function() { d3.csv("/data/SHF_guests.csv").row(function(row) {
        var name = row["Nationality"]
        var count = parseInt(row['Number of Guests'])
        var code = country_toCode[row["Nationality"]]
        var flag = country_toFlag[code]
        var coordinates = country_toCoord[row["Nationality"]]
        if (name && count && code && coordinates){
          var dict = {
            name: name,
            guest_count: count,
            flag: flag,
            country_code: code,
            coordinates: coordinates
          }
          country_to_guest_count[code] = count;
          return dict

        };


  }).get(function(error, data) {
    final_guests = data;

//create array to fill in lines to Sumba
  for (i of final_guests) {
    all_paths.push(coordinates_to_sumba(i));
  }
//create array of dictionaries to enable the flag logo
  for (i of final_guests) {
      var dict = {"lat" : i['coordinates'][1],
      "lon" : i['coordinates'][0],
      "name" : i['name'],
      country_code: i['country_code'],
      "flag": i['flag'],
      "guests": i['guest_count'],
      "posts" : {
        "No Story" : ""
      }
    }
    trip_data.push(dict)

  }



all_done = true;
//load visualization once data imports are complete
load_viz();
}
)};


//---------------------------------
// to draw the Lines
var sumba = [119.97, -9.69]


function convert_country_to_long_lat(country_name) {
  return [parseFloat(countries[country_name][1]), parseFloat(countries[country_name][0])]

}


function coordinates_to_sumba(country) {
  var coordinates = country['coordinates']

    return {type: "LineString", coordinates: [coordinates, sumba]

}
}
