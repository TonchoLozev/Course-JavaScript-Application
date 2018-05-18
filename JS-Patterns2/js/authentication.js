let auth = (() => {

    function isAuth() {
        return sessionStorage.getItem('authtoken');
    }
    function saveSession(userData) {
        sessionStorage.setItem('authtoken', userData._kmd.authtoken);
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('name', userData.name);
        sessionStorage.setItem('userId', userData._id);
    }

    function register(username, password) {
        let obj = {username: username, password: password};
        remote.post('user', '', 'basic', obj).then(saveSession).catch(console.error)
    }

    function login(username, password) {
        let obj = {username: username, password: password};
        return remote.post('user', 'login', 'basic', obj);
    }
    
    function logout() {
        remote.post('user', '_logout', 'kinvey').then(()=>{
            sessionStorage.clear();
        }).catch(console.error)
    }
    return {
        login, register, logout, isAuth, saveSession
    };
})();