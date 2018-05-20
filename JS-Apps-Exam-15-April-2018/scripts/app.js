function startApp() {
    showMenuLinks();
    if (sessionStorage.getItem('authToken') === null) {
        showStartApp();
    } else {
        loadHome()
    }
    attachAllEvents();
}