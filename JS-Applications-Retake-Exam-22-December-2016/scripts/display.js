function showView(viewName) {
    $('main > section').hide();
    $('#' + viewName).show();
}

function showMenuLinks() {
    if (sessionStorage.getItem('authToken') === null) {
        $('#linkMenuAppHome').show();
        $('#linkMenuLogin').show();
        $('#linkMenuRegister').show();
        $('#linkMenuUserHome').hide();
        $('#linkMenuShop').hide();
        $('#linkMenuCart').hide();
        $('#linkMenuLogout').hide();
        $('#spanMenuLoggedInUser').hide().text('');
    } else {
        $('#linkMenuAppHome').hide();
        $('#linkMenuLogin').hide();
        $('#linkMenuRegister').hide();
        $('#linkMenuUserHome').show();
        $('#linkMenuShop').show();
        $('#linkMenuCart').show();
        $('#linkMenuLogout').show();
        $('#spanMenuLoggedInUser').show().text(`Welcome, ${sessionStorage.getItem('username')} !`);
    }
}

function showInfo(messgae) {
    let infoBox = $('#infoBox');
    infoBox.text(messgae);
    infoBox.show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000)
}

function showError(error) {
    let errorBox = $('#errorBox');
    errorBox.text(error);
    errorBox.show();
}

function showHomeView() {
    showView('viewAppHome');
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    showView('viewRegister');
    $('#formRegister').trigger('reset');
}

function showUserHome() {
    showView('viewUserHome');
    $('#viewUserHomeHeading').text(`Welcome, ${sessionStorage.getItem('username')}!`);
}

function showShop() {
    showView('viewShop');
}

function showCart() {
    showView('viewCart')
}