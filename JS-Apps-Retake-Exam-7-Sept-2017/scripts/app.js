function startApp() {
    showMenuLinks();
    if(sessionStorage.getItem('authToken') !== null){
        loadFeed();
    }else{
        showRegisterView();
    }
    attachAllEvents();
}