$(document).ready(function () {
    //API Key for open weather API 
    const APIKey = "f7be541465a4b4b5abba7bf4b7785fc7";
    //Moment js 
    const currentDate = moment().format('L');
    //console.log(currentDate);
    let city= "";
    const searchHistory = JSON.parse(localStorage.getItem('displayCity')) === null ? [] : JSON.parse(localStorage.getItem("displayCity"));

    renderSearchList();

    function renderSearchList() {
        $('#search-list').empty();
        searchHistory.forEach(function (city) {
            let searchHistoryList =$("<li>");
            searchHistoryList.addClass("list-group-item btn btn-light");
            searchHistoryList.text(city);
            $('#search-list').prepend(searchHistoryList);
        });
        //calling function on button click 
        $('.btn').click(currentWF);
        $('.btn').click(futureWF);

        if (searchHistory != null && searchHistory[searchHistory.length - 1] != null) { currentWF(null, searchHistory[searchHistory.length - 1]);
            futureWF();
        }     
    }
//function for current weather 
    function currentWF(event, cityParam) {
        if(cityParam != null) {
            city = cityParam;
        } else if ($(this).attr("id") === "search-button") {
            city = $('#search-city').val();
        } else { city =$(this).text(); }

        var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey ;
        console.log(currentUrl);
        console.log(searchHistory.indexOf(city));

        if (searchHistory.indexOf(city) === -1) {
            searchHistory.push(city);
        }
        console.log(searchHistory);
        localStorage.setItem('displayCity', JSON.stringify(searchHistory));

        $.ajax({
            url: currentUrl,
            method: 'GET'
        }).then(function (response) {
            //console.log(response);
            $('.city-name').html(response.name + "" + currentDate);
            $('#weather-icon').attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");

            //convert temp Faranheit to Celcius, wind speed, humidity, and uv-index
            var tempF = (response.main.temp - 273.15);
           $('.current-temperature').text("Temperature:" + tempF.toFixed(2) + "°C");
            var wind = (response.wind.speed * 2.237);
            $('.current-wind').text("Wind Speed:" + wind.toFixed(2) + "MPH");
            $(".current-humidity").text("Humidity:" + response.main.humidity + "%")
           
        });
    }
    //querying the openweather database for 5 days forecast 
    function futureWF() {
        let fiveDayF = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
        let dayCount = 1;
        $.ajax({
            url: fiveDayF,
            method: 'GET'
        })
        .then(function(response) {
            for (let i = 0; i < response.list.length; i++) {
                let dateTime = response.list[i].dt_txt;
                let date = dateTime.split(' ')[0];
                let time = dateTime.split(' ')[1];

                if(time === "15:00:00") {
                    let year = date.split('-')[0];
                    let month = date.split('-')[1];
                    let day = date.split('-')[2];

             $('#forecast-' + dayCount).children('.card-date').text(month + '/' + day + '/'+ year);
             $('#forecast-' + dayCount).children('.icon').attr("src", "http://api.openweathermap.org/img/wn/"+ response.list[i].weather[0].icon + ".png");
             $('#forecast-' + dayCount).children('.card-temp').text("Temp: " + ((response.list[i].main.temp - 273.15).toFixed(2) + '°C'));
            $('#forecast-' + dayCount).children('.card-humidity').text('Humidity:' + response.list[i].main.humidity + "%");
                    dayCount ++;
                }
            }
        });
    }
    
    //listener on btn id 
    $('#search-button').click(renderSearchList);
});