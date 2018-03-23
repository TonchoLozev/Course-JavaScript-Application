function getInfo() {
    let input = $('#stopId');
    $.ajax({
        method: 'GET',
        url: `https://judgetests.firebaseio.com/businfo/${input.val()}.json `,
        success: showBusses,
        error: showError
    });

    function showBusses(res) {
        $('#stopName').text(res.name);
        for(let bus in res.buses){
            $('#buses').append($(`<li>Bus ${bus} arrives in ${res.buses[bus]} minutes</li>`))
        }
    }
    function showError() {
        $('#buses').empty();
        $('#stopName').text('Error');
    }
}