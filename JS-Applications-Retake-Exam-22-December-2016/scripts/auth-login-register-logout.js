const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Sk94diiif';
const APP_SECRET = '9d130d4828f44b049f6aa5071eda1144';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function registerUser(event) {
    event.preventDefault();
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=password]').val();
    let name = $('#formRegister input[name=name]').val();
    //console.log(username, password, name)
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: {username: username, password: password, name: name}
    }).then(function (res) {
        signInUser(res, 'User registration successful.');
    }).catch(handleError);
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
    showHomeView();
    showInfo('Logout successful.')
}

function signInUser(res, msg) {

    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('userId', res._id);
    sessionStorage.setItem('authToken', res._kmd.authtoken);

    showUserHome();
    showMenuLinks();
    showInfo(msg);
}