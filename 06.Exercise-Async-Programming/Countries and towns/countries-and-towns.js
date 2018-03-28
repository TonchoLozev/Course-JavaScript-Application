function attachEvents() {

    let username = 'guest';
    let password = 'g';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    let countriesInDataBase = [];
    loadData();

    $('#addBtn').on('click', addCountry);
    $('#deleteBtn').on('click', deleteCountry);
    $('#showTowns').on('click', showTowns);

    function addCountry() {
        let name = $('#countryInput').val();

        if (name.length > 0 && !countriesInDataBase.includes(name)) {

            let jsonData = JSON.stringify({name: name});

            countriesInDataBase.push(name);

            $.ajax({
                method: 'POST',
                url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/countries`,
                headers: authorization,
                data: jsonData,
                contentType: 'application/json'
            }).then(appendCountry).catch(handleError);

            function appendCountry() {
                $('#countries').append($(`<option>${name}</option>`));
                $('#func').text(`${name} added!`).fadeIn(300).fadeOut(2000);
            }
        } else {
            $('#func').text(`Invalid country!`).fadeIn(300).fadeOut(2000);
        }
        $('#countryInput').val('');
    }

    function deleteCountry() {
        let selected = $('#countries').find(':selected').val();
        let idToDelete;
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/countries`,
            headers: authorization
        }).then(findAndDeleteCountry).catch(handleError);

        function findAndDeleteCountry(res) {
            for (let country of res) {
                if (country.name === selected) {
                    idToDelete = country._id;
                    break;
                }
            }
            $.ajax({
                method: 'DELETE',
                url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/countries/${idToDelete}`,
                headers: authorization,
                contentType: "application/json",
            }).then(removeCountry).catch(handleError)

            function removeCountry() {
                $('#countries').find(':selected').remove();
                $('#func').text(`${selected} removed!`).fadeIn(300).fadeOut(2000);
            }
        }
    }

    function loadData() {
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/countries`,
            headers: authorization
        }).then(addCountries).catch(handleError);

        function addCountries(res) {
            for (let country of res) {
                $('#countries').append($(`<option>${country.name}</option>`));
                countriesInDataBase.push(country.name);
            }
        }
    }

    function showTowns() {
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/towns`,
            headers: authorization
        }).then(showTowns).catch(handleError);

        function showTowns(res) {
            $('#towns').empty();

            let selected = $('#countries').find(':selected').val();

            $('#towns')
                .append($('<input id="addTown">'))
                .append($('<button>Add town</button>').on('click', addTownFunc));

            for (let town of res) {
                if (town.country === selected) {

                    $('#towns')
                        .append($(`<li>`)
                            .append($('<input>').val(town.name))
                            .append($('<button>Edit</button>').on('click', editFunc))
                            .append($('<button>Delete</button>').on('click', deleteFunc)))
                }
            }
            
            function addTownFunc() {
                let town = $('#addTown').val();
                let country = selected;
                let jsonObj = JSON.stringify({name: town, country: country});

                $.ajax({
                    method: 'POST',
                    url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/towns`,
                    headers: authorization,
                    data: jsonObj,
                    contentType: 'application/json'
                }).then(appendTown).catch(handleError);
                
                function appendTown() {
                    $('#towns')
                        .append($(`<li>`)
                            .append($('<input>').val($('#addTown').val()))
                            .append($('<button>Edit</button>').on('click', editFunc))
                            .append($('<button>Delete</button>').on('click', deleteFunc)));
                    $('#addTown').val('');
                }
            }
            
            function editFunc() {

            }

            function deleteFunc() {
                let townToDeleteName = $($(this).parent().children()[0]).val();
                let element = $(this).parent();
                let currentId;
                $.ajax({
                    method: 'GET',
                    url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/towns`,
                    headers: authorization
                }).then(deleteTown).catch(handleError);

                function deleteTown(res) {
                    for(let town of res){
                        if(town.name === townToDeleteName){
                            currentId = town._id;
                            break;
                        }
                    }
                    $.ajax({
                        method: 'DELETE',
                        url: `https://baas.kinvey.com/appdata/kid_HJxYjhw9z/towns/${currentId}`,
                        headers: authorization,
                        contentType: 'application/json'
                    });
                    element.remove();
                }
            }
        }
    }

    function handleError(err) {
        console.log('Error: ' + err.status + " " + err.statusText)
    }
}