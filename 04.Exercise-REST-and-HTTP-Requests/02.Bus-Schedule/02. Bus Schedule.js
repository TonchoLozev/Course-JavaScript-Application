function solve() {
    let stopId = 'depot';
    let name;

    function depart() {
        $('#depart').attr('disabled', true);
        $('#arrive').attr('disabled', false);
        $.ajax({
            method: 'GET',
            url: `https://judgetests.firebaseio.com/schedule/${stopId}.json `,
            success: successDepart,
            error: showError
        });

        function successDepart(res) {
            name = res.name;
            $('.info').text(`Next stop ${res.name}`);
            stopId = res.next;
        }
    }

    function arrive() {
        $('#arrive').attr('disabled', true);
        $('#depart').attr('disabled', false);

        $('.info').text(`Arriving at ${name}`);

    }

    function showError() {
        $('#arrive').attr('disabled', true);
        $('#depart').attr('disabled', true);
        $('.info').text('Error');
    }

    return {
        depart,
        arrive
    };
}