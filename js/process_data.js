//this is the data that is to be replaced by SUMBA data
var trip_data = [{"lat" : -9.6993,
"lon" : 119.9741,
"name" : "Sumba",
country_code : 360,
"flag" : "images/sumba.png",
"guests" : 331,
"posts" : {
  "NoStory" : ""
}}]



//var final_codes = []
var final_guests = []
var country_toCode = {}
var country_toCoord = {}
var country_toFlag= {}

var country_flags_loaded = false;


// to import flags
var country_flags = function() { d3.tsv("https://raw.githubusercontent.com/euctrl-pru/dashboard/master/data/world-country-flags.tsv").row(function(row) {
  country_toFlag[parseInt(row["id"])] = row["url"]
  // console.log(parseInt(row["id"]))
  // console.log(row)
  row.close = +row.close;
}).get(function() {
  country_codes();
  country_flags_loaded = true;
})};



var country_codes_loaded = false;

var country_codes = function() { d3.csv("/data/country_codes.csv").row(function(row) {
  // country_toCode[row["name"]] = [row["country-code"], row["alpha-2"]]
  country_toCode[row["name"]] = [parseInt(row["country-code"])]
  console.log(row["id"])

  // console.log(country_toCode[row["short"]])
  // console.log(country_toCode[row["name"]])

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
  // console.log(final_codes)
  // console.log(d)

});
};

var all_paths = []

var country_to_guest_count = {}
var bins;
var color_options = ["#7CFC00", "#32CD32", "#006400"];

var all_done = false;
var guest_data = function() { d3.csv("/data/SHF_guests.csv").row(function(row) {
        var name = row["Nationality"]
        var count = parseInt(row['Number of Guests'])
        var code = country_toCode[row["Nationality"]]
        var flag = country_toFlag[code]
        // console.log(country_toFlag[code])
        // console.log(flag, code) *
        // var short = country_toCode[row["Nationality"][1]]
        var coordinates = country_toCoord[row["Nationality"]]
        // var flag = country_toFlag[row["url"]]
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

          // console.log(dict)
        };

        //row.close = +row.close;

        //2 10 18 24



  }).get(function(error, data) {
    final_guests = data;
  //console.log("I SHOULD BE sECond!");
  for (i of final_guests) {
    all_paths.push(coordinates_to_sumba(i));
  }

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



// histGenerator = d3.bin()
//   .domain([0,130])
//   .thresholds(3);
//   console.log(total_guest_count);
// foo = Object.values(country_to_guest_count).map(item => item.toString());
// bins = histGenerator(foo);
all_done = true;
load_viz();
}
)};


// var country_data = []
//
// for (i of guest_countries) {
//   for (j of country_codes)
//   if (i.Nationality == j.name)
//   country_data.push({
//     "name" : i.Nationality,
//     "code" : j.countrycode,
//     "guest_count" : i.NumberofGuests})
//   }
//

//
//
//      in country_codes)
// all_paths.push(coordinates_to_sumba(i))
// console.log(i);
//
// function each country_codes, guest_countries











//---------------------------------
// to draw the Lines
var sumba = [119.97, -9.69]
var link =
{type:
  "LineString",
  coordinates: [
    [14.23, 15.74],
    [23.51, -13.23]
  ]
}
//dictionary from https://geojson-maps.ash.ms/


function convert_country_to_long_lat(country_name) {
  return [parseFloat(countries[country_name][1]), parseFloat(countries[country_name][0])]

}

// function coordinates_to_sumba(country_name) {
//   console.log(convert_country_to_long_lat("fr"), sumba)
//   return {type: "LineString", coordinates: [convert_country_to_long_lat(country_name), sumba]
//   }


function coordinates_to_sumba(country) {
  var coordinates = country['coordinates']
  var name = country['name']
  var is_european = (40 <= coordinates[1] && coordinates[1] <= 62)
  && (-5 <= coordinates[0] && coordinates[0] <= 20)

  var is_brazil = (-55 == coordinates[0]) && (-10 == coordinates[1])
  var is_USA = (-97 == coordinates[0]) && (38 == coordinates[1])

  // var is_asia = (40 <= country['coordinates'[1]] && country['coordinates'[1]] <= 62) && (-5 <= country['coordinates'[0]] && country['coordinates'[0]] <= 20)
  // if (name = 'Belgium' || 'Germany' || 'Netherlands' || 'France' || 'Spain'
  // || 'Poland' || 'Azerbaijan' || 'Italy' || 'Switzerland' || 'Luxembourg')
  // var is_european = (40 <= coordinates[1] && coordinates[0]

  // console.log(coordinates[1])

    return {type: "LineString", coordinates: [coordinates, sumba]

}
}
//var all_paths = [];
