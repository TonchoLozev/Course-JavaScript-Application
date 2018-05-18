let remote = (() => {
    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_r1b78MsAG';
    const APP_SECRET = 'a0cd557c05d84f11b013f95e23ee54ff';


    function makeAuth(auth) {
        if (auth === 'basic') {
            return `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`
        } else {
            return `Kinvey ${sessionStorage.getItem('authtoken')}`;
        }
    }

    //request methods - GET, POST, PUT
    //kinvey module - (user/appdata)
    //url endpoint
    //auth
    function makeRequest(method, module, endpoint, auth) {
        return {
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            method: method,
            headers: {'Authorization': makeAuth(auth)}
        }
    }

    function get(module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth))
    }

    function post(module, endpoint, auth, data) {
        let obj = makeRequest('POST', module, endpoint, auth);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }

    function update(module, endpoint, auth, data) {
        let obj = makeRequest('PUT', module, endpoint, auth);
        obj.data = data;
        return $.ajax(obj);
    }

    function remove(module, endpoint, auth) {
        let obj = makeRequest('DELETE', module, endpoint, auth);
        return $.ajax(obj);
    }

    return {
        get, post, update, remove
    }
})();