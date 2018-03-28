function attachEvents() {
    $('#submit').on('click', showWeather);

    let weatherIcons = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601; ',
        'Rain': '&#x2614;',
        'Degrees': '&#176;'
    };

    function showWeather() {
        let currentLocation = $('#location').val();
        $.ajax({
            method: 'GET',
            url: `https://judgetests.firebaseio.com/locations.json`,
        }).then(loadData).catch(showError);

        function loadData(res) {
            let code;
            for (let location of res) {
                if (location.name === currentLocation) {
                    code = location.code;
                }
            }

            $('#forecast').css('display', 'inline');

            $.ajax({
                method: 'GET',
                url: `https://judgetests.firebaseio.com/forecast/today/${code}.json`
            }).then(showCurrentWeather).catch(showError);

            $.ajax({
                method: 'GET',
                url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
            }).then(showUpcomingWeather).catch(showError);

            function showCurrentWeather(res) {
                $('#current')
                    .append(`<span class="condition symbol">${weatherIcons[res.forecast.condition]}</span>`)
                    .append($(`<span class="condition"></span>`)
                        .append(`<span class="forecast-data">${res.name}</span>`)
                        .append(`<span class="forecast-data">${res.forecast.low}&#176;/${res.forecast.high}&#176;</span>`)
                        .append(`<span class="forecast-data">${res.forecast.condition}</span>`));

            }

            function showUpcomingWeather(res) {
                console.log(res);
                let upcoming = $(`<span class="upcoming"></span>`);
                for (let forecast of res.forecast) {
                    upcoming.append(`<span class="symbol">${weatherIcons[forecast.condition]}</span>`)
                        .append(`<span class="forecast-data">${forecast.low}&#176;/${forecast.high}&#176;</span>`)
                        .append(`<span class="forecast-data">${forecast.condition}</span>`);
                }
                $('#upcoming').append(upcoming);
            }
        }
    }

    function showError(err) {
        console.log(err);
    }
}