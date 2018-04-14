function attachAllEvents() {
    //navigation menu link events
    $('#linkMenuAppHome').on('click', showHomeView);
    $('#linkMenuUserHome').on('click', showUserHome);
    $('#linkMenuLogin').on('click', showLoginView);
    $('#linkMenuRegister').on('click', showRegisterView);
    $('#linkMenuMyMessages').on('click', loadMyMessages);
    $('#linkMenuArchiveSent').on('click', loadSentMessages);
    $('#linkMenuSendMessage').on('click', sendMessage);
    $('#linkMenuLogout').on('click', logoutUser);

    //submit button events
    $('#loginBtn').on('click', loginUser);
    $('#registerBtn').on('click', registerUser);
    $('#linkUserHomeMyMessages').on('click', loadMyMessages);
    $('#linkUserHomeArchiveSent').on('click', loadSentMessages);
    $('#linkUserHomeSendMessage').on('click', sendMessage);
    $('#sendBtn').on('click', sendMsg)

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