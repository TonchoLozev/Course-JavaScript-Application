function attach() {
    let username = 'guest';
    let password = 'g';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    $('.load').on('click', loadData);
    $('#submit').on('click',createBook);

    function loadData() {
        $('#books').empty();
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_rJQPwA89G/books`,
            headers: authorization
        }).then(loadBooks).catch(showError);

        function loadBooks(res) {
            for(let book of res){
                let title = book.title;
                let author = book.author;
                let isbn = book.isbn;
                let li = $(`<li data-id="${book._id}">`)
                    .append($(`<div class="books"></div>`)
                        .append(`<input type="text" name="field1" placeholder="Title" value="${title}"/>`)
                        .append(`<input type="email" name="field2" placeholder="Author" value="${author}"/>`)
                        .append(`<textarea name="field3" placeholder="ISBN">${isbn}</textarea>`)
                        .append($(`<input type="submit" value="Update"/>`).on('click', updateFunc))
                        .append($(`<input type="submit" value="Delete"/>`).on('click', deleteFunc)));
                $('#books').append(li)
            }
            function updateFunc() {
                let currentId = $(this).parent().parent().data().id;

                let title = $($(this).parent().children()[0]).val();
                let author = $($(this).parent().children()[1]).val();
                let isbn = $($(this).parent().children()[2]).val();

                let objToSend = JSON.stringify({title: title, author: author, isbn: isbn});
                $.ajax({
                    method: 'PUT',
                    url: `https://baas.kinvey.com/appdata/kid_rJQPwA89G/books/${currentId}`,
                    data: objToSend,
                    contentType: "application/json",
                    headers: authorization
                }).then(loadData).catch(showError)

            }
            function deleteFunc() {
                let currentId = $(this).parent().parent().data().id;
                $.ajax({
                    method: 'DELETE',
                    url: `https://baas.kinvey.com/appdata/kid_rJQPwA89G/books/${currentId}`,
                    headers: authorization,
                    contentType: "application/json"
                }).then(loadData).catch(showError)
            }
        }

    }

    function createBook() {
        let title = $('#title').val();
        let author = $('#author').val();
        let isbn = $('#isbn').val();
        console.log(title, author, isbn);
        if(title.length > 0 && author.length > 0){
            let objToSend = JSON.stringify({title: title, author: author, isbn: isbn});
            $.ajax({
                method: 'POST',
                url: `https://baas.kinvey.com/appdata/kid_rJQPwA89G/books`,
                headers: authorization,
                data: objToSend,
                contentType: "application/json"
            }).then(loadData).catch(showError)
        }
    }

    function showError(err) {
        console.log(err);
    }
}