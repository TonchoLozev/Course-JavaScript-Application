function showView(viewName) {
    $('#container > section').hide();
    $('#' + viewName).show();
}

function showMenuLinks() {
    if (sessionStorage.getItem('authToken') === null) {
        $('#profile').hide();
    } else {
        $('#profile').show();
        $('#viewUserHomeHeading').show().text(sessionStorage.getItem('username'));
    }
}

function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
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

function showStartApp() {
    showView('welcome-section');
}

function showHomeView() {
    showView('create-receipt-view');
}

function showAllReceipts() {
    showView('all-receipt-view');
}

function showReceiptDetails() {
    showView('receipt-details-view');
}

