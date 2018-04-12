function attachAllEvents() {
    //navigation menu link events
    $('#linkMenuAppHome').on('click', showHomeView);
    $('#linkMenuLogin').on('click', showLoginView);
    $('#linkMenuRegister').on('click', showRegisterView);
    $('#linkMenuUserHome').on('click', showUserHome);
    $('#linkMenuShop').on('click', loadProducts);
    $('#linkMenuLogout').on('click', logoutUser);
    $('#linkMenuCart').on('click', loadCart);

    //submit button events
    $('#loginBtn').on('click', loginUser);
    $('#registerBtn').on('click', registerUser);
    $('#linkUserHomeShop').on('click', loadProducts);
    $('#linkUserHomeCart').on('click', loadCart);
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