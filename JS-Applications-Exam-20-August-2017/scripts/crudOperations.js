const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_r1FoiGcjG';
const APP_SECRET = 'caa049046b664ab2978395c1053ab118';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

//register user/login/logout
function registerUser(event) {
    event.preventDefault();
    let username = $('#registerForm input[name=username]').val();
    let password = $('#registerForm input[name=password]').val();
    let repeatPassword = $('#registerForm input[name=repeatPass]').val();

    let nameRegex = /[A-Za-z]{3,}/;
    let passRegex = /[A-Za-z0-9]{6,}/;

    if (!username.match(nameRegex) || !password.match(passRegex) || password !== repeatPassword) {
        let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username: username, password: password}
        }).then(function (res) {
            signInUser(res, 'User registration successful.');
            $('#registerForm input[name=username]').val('');
            $('#registerForm input[name=password]').val('');
            $('#registerForm input[name=repeatPass]').val('');
        }).catch(handleError);
    }


}

function loginUser(event) {
    event.preventDefault();
    let username = $('#loginForm input[name=username]').val();
    let password = $('#loginForm input[name=password]').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username: username, password: password}
    }).then(function (res) {
        signInUser(res, 'Login successful.');
        $('#loginForm input[name=username]').val('');
        $('#loginForm input[name=password]').val('');
    }).catch(handleError);
}

function logoutUser() {
    sessionStorage.clear();
    showMenuLinks();
    showHomeView();
    showInfo('Logout successful.')
}

function signInUser(res, msg) {

    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('authToken', res._kmd.authtoken);

    listPosts();
    showMenuLinks();
    showInfo(msg);
}

//list posts/edit/create/delete
function createPost(event) {

    event.preventDefault();

    let author = sessionStorage.getItem('username');
    let linkUrl = $($(this).parent().children()[1]).val();
    let linkTitle = $($(this).parent().children()[3]).val();
    let linkImage = $($(this).parent().children()[5]).val();
    let description = $($(this).parent().children()[7]).val();

    let linkUrlRegex = /^http.+/;
    if (linkUrl.length === 0 || linkTitle.length === 0 || !linkUrl.match(linkUrlRegex)) {
        let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/posts',
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {
                author: author,
                title: linkTitle,
                url: linkUrl,
                imageUrl: linkImage,
                description: description,
            }
        }).then(function (res) {
            showInfo('Post created.');
            listPosts();
        }).catch(handleError);
    }
}

function loadEditPost(event) {
    event.preventDefault();
    $('#viewEdit').val('');
    $('#editPostForm input[name=url]').val('');
    $('#editPostForm input[name=title]').val('');
    $('#editPostForm input[name=image]').val('');
    $('#editPostForm textarea[name=description]').text('');
    let id = $(this).parent().parent().parent().parent().parent().parent().data().id;
    $('#viewEdit').val(id);
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/posts/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {

        let url = res.url;
        let title = res.title;
        let image = res.imageUrl;
        let description = res.description;

        showEditPostView();
        $('#editPostForm input[name=url]').val(url);
        $('#editPostForm input[name=title]').val(title);
        $('#editPostForm input[name=image]').val(image);
        $('#editPostForm textarea[name=description]').text(description);

        $('#btnEditPost').on('click', editPost);

    }).catch(handleError);

    function editPost(event) {
    event.preventDefault();
        let author = sessionStorage.getItem('username');
        let linkUrl = $('#editPostForm input[name=url]').val();
        let linkTitle = $('#editPostForm input[name=title]').val();
        let linkImage = $('#editPostForm input[name=image]').val();
        let description = $('#editPostForm textarea[name=description]').val();

        let linkUrlRegex = /^http.+/;
        if (linkUrl.length === 0 || linkTitle.length === 0 || !linkUrl.match(linkUrlRegex)) {
            let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
            handleError(err);
        } else {
            let id = $('#viewEdit').val();
            $.ajax({
                method: 'PUT',
                url: BASE_URL + 'appdata/' + APP_KEY + '/posts/' + id,
                headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
                data: {
                    author: author,
                    title: linkTitle,
                    url: linkUrl,
                    imageUrl: linkImage,
                    description: description,
                }
            }).then(function (res) {
                showInfo(`Post ${linkTitle} updated`);
                listPosts();
            }).catch(handleError);
        }
    }
}

function deletePost(event) {
    event.preventDefault();
    let id = $(this).parent().parent().parent().parent().parent().parent().data().id;
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/posts/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function () {
        listPosts();
        showInfo('Post deleted.')
    }).catch(handleError);
}

function loadMyPosts() {

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/posts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        displayPosts(res);
    }).catch(handleError);

    async function displayPosts(res) {
        showMyPosts();
        let posts = $('#viewMyPosts .posts');
        posts.empty();

        if (res.length > 0) {
            async function f() {
                let checkAuthorsPosts = [];
                //check is currentuser author
                res.forEach(el => {
                    if (el.author === sessionStorage.getItem('username')) {
                        el.isAuthor = true;
                        checkAuthorsPosts.push(el)
                    }
                });
                if (checkAuthorsPosts.length > 0) {
                    checkAuthorsPosts.forEach(el => {
                        el.submited = calcTime(el._kmd.ect)
                    });
                    let sorted = checkAuthorsPosts.sort((a, b) => {
                        return new Date(b._kmd.ect) - new Date(a._kmd.ect);
                    });

                    let listPosts = await $.get('./templates/post.hbs');
                    let listPostsTemplate = Handlebars.compile(listPosts);
                    let contextPosts = {
                        posts: sorted
                    };
                    let compileHBStoHtml = listPostsTemplate(contextPosts);
                    posts.append(compileHBStoHtml);
                    attachEvents();
                } else {
                    posts.empty();
                    posts.append($('<p>No posts in database</p>'));
                }
            }

            await f();

            function attachEvents() {
                $('.commentsLink').on('click', loadPostDetails);
                $('.editLink').on('click', loadEditPost);
                $('.deleteLink').on('click', deletePost);
            }
        }
        else {
            posts.empty();
            posts.append($('<p>No posts in database</p>'));
        }
    }

}

function listPosts() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/posts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        displayPosts(res);
    }).catch(handleError);

    async function displayPosts(res) {
        showCatalog();
        let posts = $('#viewCatalog .posts');
        posts.empty();

        if (res.length > 0) {
            async function f() {
                //check is currentuser author
                res.forEach(el => {
                    if (el.author === sessionStorage.getItem('username')) {
                        el.isAuthor = true;
                    }
                });
                res.forEach(el => {
                    el.submited = calcTime(el._kmd.ect)
                });
                let sorted = res.sort((a, b) => {
                    return new Date(b._kmd.ect) - new Date(a._kmd.ect);
                });

                let listPosts = await $.get('./templates/post.hbs');
                let listPostsTemplate = Handlebars.compile(listPosts);
                let contextPosts = {
                    posts: sorted
                };
                let compileHBStoHtml = listPostsTemplate(contextPosts);
                posts.append(compileHBStoHtml);
                attachEvents();
            }

            await f();

            function attachEvents() {
                $('.commentsLink').on('click', loadPostDetails);
                $('.editLink').on('click', loadEditPost);
                $('.deleteLink').on('click', deletePost);
            }
        }
        else {
            posts.empty();
            posts.append($('<p>No posts in database</p>'));
        }
    }

}

//post comments/delete/show/create

function loadPostDetails(postId) {
    showPostDetails();
    let post = $('#viewComments');
    post.empty();
    let id;
    if (postId.length > 0) {
        id = postId;
    } else {
        id = $(this).parent().parent().parent().parent().parent().parent().data().id;
    }

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/posts/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        displayPost(res);
        displayComments(res, id);
    }).catch(handleError);

    async function displayPost(res) {
        async function f() {
            res.submited = calcTime(res._kmd.ect);
            if (res.author === sessionStorage.getItem('username')) {
                res.isAuthor = true;
            }
            let checkDescription = false;
            if (res.description.length === 0) {
                checkDescription = true;
            }
            let post = await $.get('./templates/post-details.hbs');
            let postTemplate = Handlebars.compile(post);
            let contextPosts = {
                url: res.url,
                imageUrl: res.imageUrl,
                title: res.title,
                description: res.description,
                submited: res.submited,
                isAuthor: res.isAuthor,
                author: res.author,
                id: res._id,
                checkDescription: checkDescription
            };
            let compileHBStoHtml = postTemplate(contextPosts);
            $('#viewComments').append(compileHBStoHtml);
            attachEvents();
        }

        await f();

        function attachEvents() {
            $('.editLink').on('click', loadEditPost);
            $('.deleteLink').on('click', deletePost);
            $('#btnPostComment').on('click', createComment)
        }
    }
}

function createComment(event) {
    event.preventDefault();
    let postId = $('#viewComments .post').data().id;
    let author = sessionStorage.getItem('username');
    let text = $($(this).parent().children()[1]).val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/comments',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {
            author: author,
            postId: postId,
            content: text,
        }
    }).then(async function () {
        showInfo('Comment created.');
        await loadPostDetails(postId);
        $(text).val('');
    }).catch(handleError)
}

async function displayComments(res, id) {
    $('#viewComments').empty();
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/comments',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        commentsFunc(res);
    }).catch(handleError);

    async function commentsFunc(res) {
        let comments = [];
        for (let comment of res) {
            if (comment.postId === id) {
                comments.push(comment);
            }
        }
        if (comments.length > 0) {
            async function f() {
                //check is currentuser author
                comments.forEach(el => {
                    if (el.author === sessionStorage.getItem('username')) {
                        el.isAuthor = true;
                    }
                });
                comments.forEach(el => {
                    el.submited = calcTime(el._kmd.ect)
                });
                let sorted = comments.sort((a, b) => {
                    return new Date(b._kmd.ect) - new Date(a._kmd.ect);
                });

                let listComments = await $.get('./templates/comments.hbs');
                let listCommentsTemplates = Handlebars.compile(listComments);
                let contextPosts = {
                    comments: sorted
                };
                let compileHBStoHtml = listCommentsTemplates(contextPosts);
                $('#viewComments').append(compileHBStoHtml);
                attachEvents();
            }

            await f();

            function attachEvents() {
                $('.deleteLink').on('click', deleteComment);
            }
        }
        else {
            $('#viewComments').append($('<p>No posts in database</p>'));
        }

    }
}

function deleteComment() {
    event.preventDefault();
    let id = $(this).parent().parent().data().id;
    let postId = $('#viewComments .post').data().id;

    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/comments/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(async function () {
        await loadPostDetails(postId);
        showInfo('Comment deleted.')
    }).catch(handleError);
}

function handleError(err) {
    let errorMsg = JSON.stringify(err);
    if (err.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if (err.responseJSON && err.responseJSON.description) {
        errorMsg = err.responseJSON.description;
    }
    showError(errorMsg);
}

