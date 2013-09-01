var weather = {
  "current_observation": {
    "display_location": {
      "full": "San Francisco, CA"
    },
    "observation_time":"Last Updated on September 20, 3:50 AM PDT",
    "weather": "Mostly Cloudy",
    "temp_f": 54.4,
    "temp_c": 12.4,   
    "relative_humidity":"89%",
    "wind_string":"From the WNW at 4.0 MPH",
    "icon_url":"http://icons-ak.wxug.com/i/c/k/nt_mostlycloudy.gif"
  },
  "forecast": {
    "simpleforecast": {
      "forecastday": [
        { "date": { "weekday_short": "Thu" },
          "period": 1,
          "high": { "fahrenheit": "64", "celsius": "18" },
          "low": { "fahrenheit": "54", "celsius": "12" },
          "conditions": "Partly Cloudy",
          "icon_url":"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif" },
        { "date": { "weekday_short": "Fri" },
          "period": 2,
          "high": { "fahrenheit": "70", "celsius": "21" },
          "low": { "fahrenheit": "54", "celsius": "12" },
          "conditions": "Mostly Cloudy",
          "icon_url":"http://icons-ak.wxug.com/i/c/k/mostlycloudy.gif" },
        { "date": { "weekday_short": "Sat" },
          "period": 3,
          "high": { "fahrenheit": "70", "celsius": "21" },
          "low": { "fahrenheit": "52", "celsius": "11" },
          "conditions": "Partly Cloudy",
          "icon_url":"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif" }
      ]
    }
  }
};


function populateWeatherConditions (weather) {
  var tmpl, output;

  forge.logging.log("[populateWeatherConditions] beginning populating weather conditions");

  tmpl = $("#forecast_information_tmpl").html();
  output = Mustache.to_html(tmpl, weather.current_observation);
  $("#forecast_information").append(output);
  forge.logging.log("[populateWeatherConditions] finished populating forecast information");

  tmpl = $("#current_conditions_tmpl").html();
  output = Mustache.to_html(tmpl, weather.current_observation);
  $("#current_conditions").append(output);
  forge.logging.log("[populateWeatherConditions] finished populating current conditions");

  tmpl = $("#forecast_conditions_tmpl").html();
  output = Mustache.to_html(tmpl, weather.forecast.simpleforecast);
  $("#forecast_conditions table tr").append(output);
  forge.logging.log("[populateWeatherConditions] finished populating forecast conditions");

  forge.logging.log("[populateWeatherConditions] finished populating weather conditions");
};


$(function () {
  populateWeatherConditions(weather);
});
