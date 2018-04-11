function attachAllEvents() {
    //navigation menu link events
    // $('#linkHome').on('click', showHomeView);
    // $('#linkLogin').on('click', showLoginView);
    $('#linkMyPosts').on('click', loadMyPosts);
    $('#linkListPosts').on('click', listPosts);
    $('#linkCreatePost').on('click', showCreatePostView);
    $('#logout').on('click', logoutUser);

    //submit button events
    $('#btnLogin').on('click', loginUser);
    $('#btnRegister').on('click', registerUser);
    $('#btnSubmitPost').on('click', createPost);
    //  $('#buttonEditAd').on('click', editAd);

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