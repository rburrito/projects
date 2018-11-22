if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    $(".get-location").html(
      "<i>Latitude</i>: " + lat + ", <i>Longitude</i>: " + long
    );

    var LatLong = "api/current?lat=" + lat + "&lon=" + long;
    var weatherAPI = "https://fcc-weather-api.glitch.me/" + LatLong;

    $.getJSON(weatherAPI).done(function(data) {
      console.log(data);

      celsius = data.main.temp;
      fahren = data.main.temp * 1.8 + 32;
      temperature = data.main.temp;
      borough = data.name;
      $(".borough").html("Location: " + data.name + ", " + data.sys.country);
      $(".temp").html("Temperature: " + temperature.toFixed(2) + "&deg");

      $(".btn").on("click", function(event) {
        if (temperature === celsius) {
          $(this)
            .css("background-color", "DodgerBlue")
            .text("Fahrenheit");
          temperature = fahren;
          $(".temp").html("Temperature: " + temperature.toFixed(2) + "&deg");
        } else {
          $(this)
            .css("background-color", "Grey")
            .text("Celsius");
          temperature = celsius;
          $(".temp").html("Temperature: " + temperature.toFixed(2) + "&deg");
        }
      });

      $(".get-weather").html(
        "Description: " +
          data.weather[0].description +
          "<br>" +
          "<img src=" +
          data.weather[0].icon +
          ">"
      );

    });
  });
}

/*
  $.ajax({
  dataType: "json",
  url: weatherAPI,
  success: function(climate) {
   precipitation = weather[0].main;
   temperature= main.temp;
    icon=response.weather[0].icon;
    $(".get-weather").text(temperature +" "+ precipitation+" "+ icon);
  },
  cache: false
});

  });
*/
