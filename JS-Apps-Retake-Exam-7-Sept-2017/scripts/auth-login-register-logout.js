const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_HJy2pwJ2z';
const APP_SECRET = 'f59c9fa3245a42dbb48c759eda60f0d1';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function registerUser(event) {
    event.preventDefault();
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=password]').val();
    let repeatPassword = $('#formRegister input[name=repeatPass]').val();
    let array = JSON.stringify([]);
    //console.log(username, password, repeatPassword);
    if (username.length < 5 || password.length === 0 || password !== repeatPassword) {
        let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username: username, password: password, subscriptions: array}
        }).then(function (res) {
            signInUser(res, 'User registration successful.');
        }).catch(handleError);
    }
}


function loginUser(event) {
    event.preventDefault();
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=password]').val();
    //console.log(username, password)
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username: username, password: password}
    }).then(function (res) {
        signInUser(res, 'Login successful.');
    }).catch(handleError);
}


function logoutUser() {
    sessionStorage.clear();
    showMenuLinks();
    showRegisterView();
    showInfo('Logout successful.')
}

function signInUser(res, msg) {

    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('authToken', res._kmd.authtoken);

    loadFeed();
    showMenuLinks();
    showInfo(msg);
}