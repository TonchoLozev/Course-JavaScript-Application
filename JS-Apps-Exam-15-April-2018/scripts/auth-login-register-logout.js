const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_ry0fkAg2G';
const APP_SECRET = 'f9ec6197fa764c849277ef7fa5ee2c59';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function registerUser(event) {
    event.preventDefault();
    let username = $('#register-form input[name=username-register]');
    let password = $('#register-form input[name=password-register]');
    let passwordCheck = $('#register-form input[name=password-register-check]');

    if (username.val().length < 5 || password.val().length === 0 || password.val() !== passwordCheck.val()) {
        let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username: username.val(), password: password.val()}
        }).then(function (res) {
            username.val('');
            password.val('');
            passwordCheck.val('');
            signInUser(res, 'User registration successful.');
        }).catch(handleError);
    }
}


function loginUser(event) {
    event.preventDefault();
    let username = $('#login-form input[name=username-login]');
    let password = $('#login-form input[name=password-login]');
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username: username.val(), password: password.val()}
    }).then(function (res) {
        username.val('');
        password.val('');
        signInUser(res, 'Login successful.');
    }).catch(handleError);
}


function logoutUser() {
    sessionStorage.clear();
    showMenuLinks();
    showStartApp();
    showInfo('Logout successful.')
}

function signInUser(res, msg) {

    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('authToken', res._kmd.authtoken);

    loadHome();
    showMenuLinks();
    showInfo(msg);
}