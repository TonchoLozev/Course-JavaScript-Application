function attachAllEvents() {
    //navigation menu link events
    $('#linkRegister').on('click', showRegisterView);
    $('#linkLogin').on('click', showLoginView);
    $('#linkLogOut').on('click', logoutUser);
    $('#linkMyFeed').on('click', loadUserFeed);
    $('#linkHome').on('click', loadFeed);
    $('#linkDiscover').on('click', discoverUsers);
    //$('#linkMenuCart').on('click', loadCart);

    //submit button events
    $('#btnLogin').on('click', loginUser);
    $('#btnRegister').on('click', registerUser);
    $('#btnSubmitChirp').on('click', createChirp);
    $('#btnSubmitChirpMy').on('click', createChirp);
//
//    //bind info boxes
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