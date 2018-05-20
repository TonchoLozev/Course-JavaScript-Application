function attachAllEvents() {
    //navigation menu link events
    $('#linkLogout').on('click', logoutUser);
    $('#linkAllReceipts').on('click', loadAllReceipts);
    $('#linkEditor').on('click', loadHome);

    //submit button events
    $('#loginBtn').on('click', loginUser);
    $('#registerBtn').on('click', registerUser);
    //$('#linkUserHomeCart').on('click', loadCart);

    //bind info boxes
    $('#infoBox, #errorBox').on('click', function () {
        $(this).fadeOut();
    });

    //Attach AJAX loading event listener
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show()
        },
        ajaxStop: function () {
            $('#loadingBox').hide()
        }
    })
}