function attachEvents() {
    //user
    let username = 'guest';
    let password = 'guest';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    $('.load').on('click', loadData);
    $('.add').on('click', addData);

    function loadData() {
        $('#catches').empty();
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_SyGdWcLcM/biggestCatches`,
            headers: authorization
        }).then(loadCatches).catch(showError);
    }

    function addData() {
        let angler = $('#addForm .angler').val();
        let weight = Number($('#addForm .weight').val());
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = Number($('#addForm .captureTime').val());

        let objToSend = JSON.stringify({
            angler: angler,
            weight: weight,
            species: species,
            location: location,
            bait: bait,
            captureTime: captureTime
        });

        $.ajax({
            method: 'POST',
            url: `https://baas.kinvey.com/appdata/kid_SyGdWcLcM/biggestCatches`,
            headers: authorization,
            data: objToSend,
            contentType: "application/json"
        }).catch(showError);

        $('#addForm .angler').val('');
        $('#addForm .weight').val('');
        $('#addForm .species').val('');
        $('#addForm .location').val('');
        $('#addForm .bait').val('');
        $('#addForm .captureTime').val('')
    }

    function loadCatches(res) {

        for (let data of res) {
            let div = $(`<div class="catch" data-id="<${data._id}>">
            <label>Angler</label>
            <input type="text" class="angler" value="${data.angler}"/>
            <label>Weight</label>
            <input type="number" class="weight" value="${Number(data.weight)}"/>
            <label>Species</label>
            <input type="text" class="species" value="${data.species}"/>
            <label>Location</label>
            <input type="text" class="location" value="${data.location}"/>
            <label>Bait</label>
            <input type="text" class="bait" value="${data.bait}"/>
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${Number(data.captureTime)}"/>
        </div>`);

            div.append($('<button class="update">Update</button>').on('click', updateFunc))
                .append($('<button class="delete">Delete</button>').on('click', deleteFunc));

            $('#catches').append(div);
        }

        function updateFunc() {
            let currentCatch = $(this).parent().data().id.substr(1);
            currentCatch = currentCatch.substr(0, currentCatch.length - 1);
            let angler = $($(this).parent().children()[1]).val();
            let weight = $($(this).parent().children()[3]).val();
            let species = $($(this).parent().children()[5]).val();
            let location = $($(this).parent().children()[7]).val();
            let bait = $($(this).parent().children()[9]).val();
            let captureTime = $($(this).parent().children()[11]).val();

            let objToSend = JSON.stringify({
                angler: angler,
                weight: weight,
                species: species,
                location: location,
                bait: bait,
                captureTime: captureTime
            });
            $.ajax({
                method: 'PUT',
                url: `https://baas.kinvey.com/appdata/kid_SyGdWcLcM/biggestCatches/${currentCatch}`,
                headers: authorization,
                data: objToSend,
                contentType: "application/json"
            }).catch(showError);
            loadData();
        }

        function deleteFunc() {
            let currentCatch = $(this).parent().data().id.substr(1);
            currentCatch = currentCatch.substr(0, currentCatch.length - 1);
            $.ajax({
                method: 'DELETE',
                url: `https://baas.kinvey.com/appdata/kid_SyGdWcLcM/biggestCatches/${currentCatch}`,
                headers: authorization,
                contentType: "application/json"
            }).catch(showError);
            loadData();
        }
    }

    function showError(err) {
        console.log(err);
    }
}