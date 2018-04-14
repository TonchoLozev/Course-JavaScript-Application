function showView(viewName) {
    $('#main > section').hide();
    $('#' + viewName).show();
}

function showMenuLinks() {
    if (sessionStorage.getItem('authToken') === null) {
        $('.menu').hide();
    } else {
        $('.menu').show();
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

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    showView('viewRegister');
    $('#formRegister').trigger('reset');
}

function showMainFeed() {
    showView('viewFeed');
    $('#userNameTitle').text(sessionStorage.getItem('username'));
}

function showMyFeed() {
    showView('viewMe');
    $('#myFeedName').text(sessionStorage.getItem('username'));
}

function showDiscover() {
    showView('viewDiscover')
}

function showUserProfile() {
    showView('viewProfile');
}