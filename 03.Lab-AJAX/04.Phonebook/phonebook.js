function attachEvents() {

    const url = 'https://phonebook-b8ea1.firebaseio.com/phonebook';

//Button load, loads all the data from phonebook
    $('#btnLoad').on('click', loadData);

//Button create nel data for the phoneboook
    $('#btnCreate').on('click', createData);

    function loadData() {
        $('#phonebook').empty();

        $.ajax({
            method: 'GET',
            url: url + '.json',
            success: getData,
            error: errorFunc
        });

        //phonebook or response
        function getData(phonebook) {
            for (let key in phonebook) {
                let li = $(`<li>${phonebook[key].person}: ${phonebook[key].phone} </li>`);
                li.append($('<a href="#">[Delete]</a>').on('click', function () {
                    let that = this;
                    $.ajax({
                        method: 'DELETE',
                        url: url + `/${key}.json`,
                        success: delHtml,
                        error: errorFunc
                    });

                    function delHtml() {
                        $(that).parent().remove();
                    }
                }));
               ////li.append($('<a href="#">[Edit]</a>').on('click', function () {

               //    let that = this;

               //    let personIn = $('<input>').attr('id', 'personIn');
               //    let phoneIn = $('<input>').attr('id', 'phoneIn');

               //    let submit = $('<button>Submit</button>').on('click', function () {
               //        console.log($('#personIn').val());
               //        console.log($('#phoneIn').val());
               //        if ($('#personIn').val().length > 0) {
               //            $.ajax({
               //                method: 'PUT',
               //                url: url + `/${key}/person.json`,
               //                data: "\"" + $('#personIn').val() + "\"",
               //                success: loadData,
               //                error: errorFunc
               //            });
               //        }
               //        if ($('#phoneIn').val().length > 0) {
               //            $.ajax({
               //                method: 'PUT',
               //                url: url + `/${key}/phone.json`,
               //                data: "\"" + $('#phoneIn').val() + "\"",
               //                success: loadData,
               //                error: errorFunc
               //            });
               //        }
               //    }).attr('id', 'submit');
                  //  $('#personIn').remove();
                   // $('#phoneIn').remove();
                 //   $('#submit').remove();

                 //   $(that).parent().append(personIn).append(phoneIn)////.append(submit);

////
               // }));
                $('#phonebook').prepend(li);
            }
        }
    }

    function createData() {
        let personInput = $('#person').val();
        let phoneInput = $('#phone').val();
        let jsonObj = JSON.stringify({person: personInput, phone: phoneInput});
        if (personInput.length > 0 && phoneInput.length > 0) {
            $.ajax({
                method: 'POST',
                url: url + '.json',
                data: jsonObj,
                success: addHtmlm,
                error: errorFunc
            });
            $('#person').val('');
            $('#phone').val('');

        }

        function addHtmlm() {
            if ($('#phonebook').children().length > 0) {
                let li = $(`<li>${personInput}: ${phoneInput} </li>`);
                li.append($('<a href="#">[Delete]</a>').on('click', function () {
                    let that = this;
                    $.ajax({
                        method: 'DELETE',
                        url: url + `/${key}.json`,
                        success: delHtml,
                        error: errorFunc
                    });

                    function delHtml() {
                        $(that).parent().remove();
                    }
                }));
              //  li.append($('<a href="#">[Edit]</a>').on('click', function () {
//
              //  }));
                $('#phonebook').prepend(li);
            }
        }
    }

    function errorFunc(er) {
        console.log(er);
    }
}