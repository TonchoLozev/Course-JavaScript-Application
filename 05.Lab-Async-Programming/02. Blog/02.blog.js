function attachEvents() {
    $('#btnLoadPosts').on('click', loadPosts);
    $('#btnViewPost').on('click', viewPosts);
    let username = 'jorj';
    let password = 'j';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    function loadPosts() {
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_H1M3zlN9M/posts`,
            headers: authorization
        }).then(attachOptions).catch(showError);

        function attachOptions(res) {
            for (let post of res) {
                let option = $(`<option value="${post._id}">${post.title}</option>`);
                $('#posts').append(option);
            }
        }
    }

    function viewPosts() {
        let selected = $('#posts').find(':selected').val();

        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_H1M3zlN9M/posts/${selected}`,
            headers: authorization
        }).then(attachTitleAndBody).catch(showError);
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_H1M3zlN9M/comments/?query={"post_id":"${selected}"}`,
            headers: authorization
        }).then(attachComments).catch(showError);

        function attachTitleAndBody(res) {
            $('#post-title').text(`${res.title}`);
            $('#post-body').text(`${res.body}`);
        }
        function attachComments(res) {
            $('#post-comments').empty();
            for(let comment of res){
                $('#post-comments').append(`<li>${comment.text}</li>`)
            }
        }
    }

    function showError(err) {
        console.log(err)
    }
}