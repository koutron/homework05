var APIKey = "2f7549e8e6cdbfa114ce6f316998c493";

renderLocalStorage();

$("#submitBtn").on("click", function () {
    event.preventDefault();
    var cityName = $("#cityInput").val();
    localStorage.setItem("city", cityName);
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        renderWeather(response);

        var uviURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        $.ajax({
            url: uviURL,
            method: "GET"
        }).then(function (response) {
            $("#wUVIndex1").text(response.value);
    
            if(response.value >= 0 && response.value <= 2.99){
                $("#wUVIndex1").css("background-color", "green");
            } else if(response.value >= 3 && response.value <= 5.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else if(response.value >= 6 && response.value <= 7.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else {
                $("#wUVIndex1").css("background-color", "red");
            }
        });
    });

    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function (response) {
        renderFiveDay(response);
    });

    addToList(cityName);
});


$("#cityList").on("click", function (event) {
    event.preventDefault();

    var cityName = $(event.target).text();
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        renderWeather(response);

        var uviURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        $.ajax({
            url: uviURL,
            method: "GET"
        }).then(function (response) {
            $("#wUVIndex1").text(response.value);
    
            if(response.value >= 0 && response.value <= 2.99){
                $("#wUVIndex1").css("background-color", "green");
            } else if(response.value >= 3 && response.value <= 5.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else if(response.value >= 6 && response.value <= 7.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else {
                $("#wUVIndex1").css("background-color", "red");
            }
        });
    });

    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        renderFiveDay(response);
    });

});

function renderWeather(data) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = month + "/" + day + "/" + year;
    
    $("#wCity").text("City: " + data.name + " " + "(" + newdate + ")");
    var tempF = (data.main.temp - 273.15) * 1.8 + 32;
    tempF = tempF.toFixed(2);
    $("#wTemp").text("Temperature: " + tempF);
    $("#wHumidity").text("Humidity: " + data.main.humidity);
    $("#wWindSpeed").text("Wind Speed: " + data.wind.speed);
    renderIcon(data.weather[0].main);
}

function renderIcon(condition){
    //I tried searching all over the US/World to see different condition results and only was able to find Clear, Clouds, and Rain.  The Thunderstorm is a guess.
    switch(condition){
        case "Clear": $("#wIcon").attr("src", "./Assets/images/sunny.png");
            break;
        case "Clouds": $("#wIcon").attr("src", "./Assets/images/cloudy.png");
            break;
        case "Rain": $("#wIcon").attr("src", "./Assets/images/rainy.png");
            break;
        case "Thunderstorm": $("#wIcon").attr("src", "./Assets/images/thunderstorm.png");
            break;
    }
}

function renderFiveDay(data) {

    var fiveDayArr = getForecastForEachDay(data.list);
    $(".fiveDay").text("");
    for (var i = 0; i < fiveDayArr.length; i++) {
        
        var divEl = $("<div>");
        divEl.css("margin", "0px 40px 0px 0px");

        var dateEl = $("<h6>");
        dateEl.text("Date: " + fiveDayArr[i].dt_txt.split(" ")[0]);

        var iconEl = $("<img>");
        renderFiveDayIcons(fiveDayArr[i].weather[0].main, iconEl);
        var tempEl = $("<p>");
        var tempF = (fiveDayArr[i].main.temp - 273.15) * 1.8 + 32;
        tempF = tempF.toFixed(2);
        tempEl.text("Temp: " + tempF);

        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + fiveDayArr[i].main.humidity);

        divEl.append(dateEl).append(iconEl).append(tempEl).append(humidityEl);

        $(".fiveDay").append(divEl);
    }

}

function renderFiveDayIcons(condition, iconEl){
    console.log(condition);
    switch(condition){
        case "Clear": iconEl.attr("src", "./Assets/images/sunny.png");
            break;
        case "Clouds": iconEl.attr("src", "./Assets/images/cloudy.png");
            break;
        case "Rain": iconEl.attr("src", "./Assets/images/rainy.png");
            break;
        case "Thunderstorm": iconEl.attr("src", "./Assets/images/thunderstorm.png");
            break;
    }
}

function getForecastForEachDay(listOfForecasts) {
    var currentDate = "";
    var forecastArray = [];
    for (var i = 0; i < listOfForecasts.length; i++) {
        // We want to capture one weather object for each day in the list. Once we've captured that
        // object, we can ignore all other objects for the same day
        var dateOfListItem = listOfForecasts[i].dt_txt.split(" ")[0];
        if (dateOfListItem !== currentDate) {
            // We need to extract just the date part and ignore the time
            currentDate = dateOfListItem.split(" ")[0];
            // Push this weather object to the forecasts array
            if (forecastArray.length < 5) {
                forecastArray.push(listOfForecasts[i]);
            }
        }
    }
    return forecastArray;
}

function addToList(city) {
    var liTag = $("<li>");
    liTag.text(city);
    $("#cityList").append(liTag);
}

function renderLocalStorage() {

    var cityName = localStorage.getItem("city");
    if (cityName) {
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

        $.ajax({
            url: weatherURL,
            method: "GET"
        }).then(function (response) {
            renderWeather(response);

            var uviURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            $.ajax({
                url: uviURL,
                method: "GET"
            }).then(function (response) {
                $("#wUVIndex1").text(response.value);
    
            if(response.value >= 0 && response.value <= 2.99){
                $("#wUVIndex1").css("background-color", "green");
            } else if(response.value >= 3 && response.value <= 5.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else if(response.value >= 6 && response.value <= 7.99){
                $("#wUVIndex1").css("background-color", "yellow");
            } else {
                $("#wUVIndex1").css("background-color", "red");
            }
            });
        });

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function (response) {
            renderFiveDay(response);
        });
    }

}

