var APIKey = "2f7549e8e6cdbfa114ce6f316998c493";



$("#submitBtn").on("click", function(){
    event.preventDefault();
    var cityName = $("#cityInput").val();
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(response){
        renderWeather(response);
    });

    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function(response){
        renderFiveDay(response);
    });

    addToList(cityName);
});

function renderWeather(data){
    $("#wCity").text("City: " + data.name);
    var tempF = (data.main.temp - 273.15) * 1.8 + 32;
    tempF = tempF.toFixed(2);
    $("#wTemp").text("Temperature: " + tempF);
    $("#wHumidity").text("Humidity: " + data.main.humidity);
    $("#wWindSpeed").text("Wind Speed: " + data.wind.speed);
}

function renderFiveDay(data){
    var fiveDayArr = getForecastForEachDay(data.list);
    console.log(fiveDayArr);
    $(".fiveDay").text("");
    for(var i=0; i<fiveDayArr.length; i++){
        
        var divEl = $("<div>");
        
        var dateEl = $("<h5>");
        dateEl.text("Date: " + fiveDayArr[i].dt_txt.split(" ")[0]);
        
        var tempEl = $("<p>");
        var tempF = (fiveDayArr[i].main.temp - 273.15) * 1.8 + 32;
        tempF = tempF.toFixed(2);
        tempEl.text("Temp: " + tempF);

        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + fiveDayArr[i].main.humidity);

        divEl.append(dateEl).append(tempEl).append(humidityEl);

        $(".fiveDay").append(divEl);
    }

}

function getForecastForEachDay(listOfForecasts){
    var currentDate = "";
    var forecastArray = [];
    for(var i=0; i<listOfForecasts.length; i++){
      // We want to capture one weather object for each day in the list. Once we've captured that
      // object, we can ignore all other objects for the same day
      var dateOfListItem = listOfForecasts[i].dt_txt.split(" ")[0];
      if( dateOfListItem !== currentDate ){
        // We need to extract just the date part and ignore the time
        currentDate = dateOfListItem.split(" ")[0];
        // Push this weather object to the forecasts array
        if( forecastArray.length < 5 ){
          forecastArray.push(listOfForecasts[i]);
        }
      }
    }
    return forecastArray;
  }

function addToList(city){
    var liTag = $("<li>");
    liTag.text(city);
    $("#cityList").append(liTag);
}

