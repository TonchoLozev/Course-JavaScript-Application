function attachEvents() {
    let url = 'https://phonebook-b8ea1.firebaseio.com/phonebook.json';
    $('#btnLoad').on('click', loadData);
    $('#btnCreate').on('click', createData);

    function loadData() {
        $.ajax({
            method: 'GET',
            url: url,
            success: showData,
            error: showError
        });
        function showData(res) {
            $('#phonebook').empty();
            for(let phone in res){
                let li = $(`<li>${res[phone].person}: ${res[phone].phone} </li>`);
                li.append($('<button>[Delete]</button>').on('click', function () {
                    $.ajax({
                        method: 'DELETE',
                        url: `https://phonebook-b8ea1.firebaseio.com/phonebook/${phone}.json`,
                        success: loadData,
                        error: showError
                    });
                }));
                $('#phonebook').append(li);
            }
        }
    }
    function createData() {
        let person = $('#person');
        let phone = $('#phone');
        let obj = JSON.stringify({person: person.val(), phone: phone.val()});

        $.ajax({
            method: 'POST',
            url: url,
            data:obj,
            success: loadData,
            error: showError
        });
        $('#person').val('');
        $('#phone').val('');

    }
    function showError(err) {
        console.log(err);
    }
}