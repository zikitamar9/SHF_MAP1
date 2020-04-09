var guest_countries = [
  {
    "Nationality": "Indonesia",
    "Number of Guests": 121,
    "Percentage of total guests": "36.34%"
  },
  {
    "Nationality": "Belgium",
    "Number of Guests": 24,
    "Percentage of total guests": "7.21%"
  },
  {
    "Nationality": "United States",
    "Number of Guests": 17,
    "Percentage of total guests": "5.11%"
  },
  {
    "Nationality": "Germany",
    "Number of Guests": 15,
    "Percentage of total guests": "4.50%"
  },
  {
    "Nationality": "Netherlands",
    "Number of Guests": 16,
    "Percentage of total guests": "4.80%"
  },
  {
    "Nationality": "France",
    "Number of Guests": 22,
    "Percentage of total guests": "6.61%"
  },
  {
    "Nationality": "Spain",
    "Number of Guests": 16,
    "Percentage of total guests": "4.80%"
  },
  {
    "Nationality": "Australia",
    "Number of Guests": 10,
    "Percentage of total guests": "3.00%"
  },
  {
    "Nationality": "Canada",
    "Number of Guests": 2,
    "Percentage of total guests": "0.60%"
  },
  {
    "Nationality": "Malaysia",
    "Number of Guests": 6,
    "Percentage of total guests": "1.80%"
  },
  {
    "Nationality": "United Kingdom",
    "Number of Guests": 9,
    "Percentage of total guests": "2.70%"
  },
  {
    "Nationality": "Myanmar",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "Sweden",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "Azerbaijan",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "China",
    "Number of Guests": 22,
    "Percentage of total guests": "6.61%"
  },
  {
    "Nationality": "India",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "Italy",
    "Number of Guests": 19,
    "Percentage of total guests": "5.71%"
  },
  {
    "Nationality": "Hungary",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "Korea",
    "Number of Guests": 0,
    "Percentage of total guests": "0.00%"
  },
  {
    "Nationality": "Luxembourg",
    "Number of Guests": 2,
    "Percentage of total guests": "0.60%"
  },
  {
    "Nationality": "New Zealand",
    "Number of Guests": 6,
    "Percentage of total guests": "1.80%"
  },
  {
    "Nationality": "Singapore",
    "Number of Guests": 9,
    "Percentage of total guests": "2.70%"
  },
  {
    "Nationality": "Switzerland",
    "Number of Guests": 2,
    "Percentage of total guests": "0.60%"
  },
  {
    "Nationality": "Israel",
    "Number of Guests": 2,
    "Percentage of total guests": "0.60%"
  },
  {
    "Nationality": "Iran",
    "Number of Guests": 2,
    "Percentage of total guests": "0.60%"
  },
  {
    "Nationality": "Brazil",
    "Number of Guests": 5,
    "Percentage of total guests": "1.50%"
  },
  {
    "Nationality": "Poland",
    "Number of Guests": 1,
    "Percentage of total guests": "0.30%"
  },
  {
    "Nationality": "",
    "Number of Guests": "",
    "Percentage of total guests": ""
  },
  {
    "Nationality": "",
    "Number of Guests": "",
    "Percentage of total guests": ""
  },
  {
    "Nationality": "Total",
    "Number of Guests": 333,
    "Percentage of total guests": "100.00%"
  }
]

var final_codes = []
var final_guests = []
var country_toCode = {}
var country_toCoord = {}



var country_codes = d3.csv("/data/country_codes.csv", function(data) {
    data.forEach(function(row) {
      country_toCode[row["name"]] = row["country-code"]
        row.close = +row.close;
      })
      // console.log(final_codes)
      // console.log(d)

  });

var geoCoord_data = d3.csv("/data/geocoordinates.csv", function(data) {
    data.forEach(function(row) {
      country_toCoord[row["Country"]] = [row["Longitude"], row['Latitude']]
        row.close = +row.close;
      })
      // console.log(final_codes)
      // console.log(d)

  });

  var all_paths = []


var guest_data = d3.csv("/data/SHF_guests.csv", function(data) {
    data.forEach(function(row) {
      var name = row["Nationality"]
      var count = row['Number of Guests']
      var code = country_toCode[row["Nationality"]]
      var coordinates = country_toCoord[row["Nationality"]]
      // if (name && count && code && coordinates){
      var dict = {
        name: name,
        guest_count: count,
        country_code: code,
        coordinates: coordinates
      // }
    };

      final_guests.push(dict)
//2 10 18 24
      row.close = +row.close;
    })
    for (i of final_guests) {
    all_paths.push(coordinates_to_sumba(i['coordinates']))
  }});






// for(country in guest_data) {
//   var dict = {
//     name: country[Nationality],
//     guest_count: country['Number of Guests:'],
//     // country_code: countrycode[country[Nationality][country_code["country code"]]]
//   };









// d3.csv("/data/SHF_guests.csv.csv", function(d) {
//   return {
//     nationality : +d["Nationality"],
//     guest_count : +d["Number of Guests"],
//     guest_percentage : +d["Percentage of total guests"]
//   };
// }).then(function(data) {
//   console.log(data[0]);
// });
