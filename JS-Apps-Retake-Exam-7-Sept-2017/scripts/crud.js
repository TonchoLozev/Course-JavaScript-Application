function loadFeed(event) {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (users) {
        let followers = 0;
        let user;
        for (let curUser of users) {
            if (curUser._id === sessionStorage.getItem('userId')) {
                user = curUser;
            };
            if (curUser.subscriptions.includes(sessionStorage.getItem('username'))) {
                followers++;
            }
        }

        let subscriptions = user.subscriptions;
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/chirps',
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (chirps) {
            let chirpsToLoad = [];
            let authorChirps = 0;

            for (let chirp of chirps) {
                if (subscriptions.includes(chirp.author)) {
                    chirpsToLoad.push(chirp);
                }
                if (chirp._acl.creator === sessionStorage.getItem('userId')) {
                    authorChirps++;
                }
            }
            if (subscriptions.length > 0) {
                loadChirps(chirpsToLoad, subscriptions, followers, authorChirps);
            } else {
                loadChirps(0, subscriptions, followers, authorChirps);
            }
        }).catch(handleError);
    }).catch(handleError);

    async function loadChirps(chirps, sub, followers, authorChirps) {
        showMainFeed();
        let table = $('#chirps');
        table.empty();
        chirps = chirps.sort((a, b) => {
            return new Date(b._kmd.ect) - new Date(a._kmd.ect);
        });
        if (chirps.length > 0) {
            async function f() {
                chirps = chirps.sort((a, b) => {
                    return new Date(b._kmd.ect) - new Date(a._kmd.ect);
                });
                chirps.forEach(el => {
                    el.time = calcTime(el._kmd.ect)
                });
                let chirpsTemplates = await $.get('./templates/chirps.hbs');
                let chirpsCompile = Handlebars.compile(chirpsTemplates);

                let contextProducts = {
                    chirps: chirps
                };
                let compileHBStoHtml = chirpsCompile(contextProducts);
                table.append(compileHBStoHtml);
                attachEvents(sub, followers, authorChirps)
            }

            await f();
        } else {
            table.append('<p>No chirps in database.</p>')
        }

        function attachEvents(sub, followers, authorChirps) {
            $($('#userStats').children()[0]).text(authorChirps + ' chirps');
            $($('#userStats').children()[1]).text(JSON.parse(sub).length + ' fallowing');
            $($('#userStats').children()[2]).text(followers + ' followers');
        }
    }


}

function createChirp(event) {
    event.preventDefault();
    let text = $(this).prev();
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/chirps',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {text: text.val(), author: sessionStorage.getItem('username')}
    }).then(function (res) {
        text.val('');
        showInfo('Chirp published.');
        loadUserFeed();
    }).catch(handleError);

}

function loadUserFeed(event) {
    event.preventDefault();
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/chirps',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(async function (chirps) {
        showMyFeed();
        let table = $('#myChirps');
        table.empty();
        let chirpsToLoad = [];
        for (let chirp of chirps) {
            if (sessionStorage.getItem('userId') === chirp._acl.creator) {
                chirpsToLoad.push(chirp);
            }
        }
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'user/' + APP_KEY,
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (users) {
            let currentUser;
            let followers = 0;
            for (let user of users) {
                if (user._id = sessionStorage.getItem('userId')) {
                    currentUser = user;
                }
                if (user.subscriptions.includes(sessionStorage.getItem('username'))) {
                    followers++;
                }
            }
            let following = JSON.parse(currentUser.subscriptions);
            console.log(following)
            $($('#myStats').children()[0]).text(chirpsToLoad.length + ' chirps');
            $($('#myStats').children()[1]).text(following.length + ' following');
            $($('#myStats').children()[2]).text(followers + ' followers');
        }).catch(handleError);
        if (chirpsToLoad.length > 0) {
            async function f() {
                chirpsToLoad = chirpsToLoad.sort((a, b) => {
                    return new Date(b._kmd.ect) - new Date(a._kmd.ect);
                });
                chirpsToLoad.forEach(el => {
                    el.time = calcTime(el._kmd.ect)
                });
                let chirpsTemplates = await $.get('./templates/myChirps.hbs');
                let chirpsCompile = Handlebars.compile(chirpsTemplates);

                let contextProducts = {
                    chirps: chirpsToLoad
                };
                let compileHBStoHtml = chirpsCompile(contextProducts);
                table.append(compileHBStoHtml);
                attachEvents();
            }

            await f();
        } else {
            table.append('<p>No chirps in database</p>');
        }

        function attachEvents() {
            $('.deleteBtn').on('click', deleteChirp)
        }

    }).catch(handleError);

}

function deleteChirp(event) {
    event.preventDefault();
    let chirpId = $(this).parent().parent().data().id;

    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/chirps/' + chirpId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function () {
        showInfo('Chirp deleted.');
        loadUserFeed();
    }).catch(handleError);
}

function discoverUsers() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(async function (res) {
        showDiscover();
        let table = $('#userlist');
        table.empty();

        async function f() {
            let users = res.filter(user => user._id !== sessionStorage.getItem('userId'));
            users.forEach(el => {
                el.followers = el.subscriptions.length;
            });
            let usersTemplate = await $.get('./templates/discover.hbs');
            let usersCompile = Handlebars.compile(usersTemplate);

            let contextProducts = {
                users: users
            };
            let compileHBStoHtml = usersCompile(contextProducts);
            table.append(compileHBStoHtml);
            attachEvents();
        }

        await f();

        function attachEvents() {
            $('.chirp-author').on('click', viewUserProfile);
        }
    }).catch(handleError)
}

function viewUserProfile() {
    let userId = $(this).parent().parent().data().id;

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY + '/' + userId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (user) {
        let userTosee = user;
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'user/' + APP_KEY,
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (users) {

            let currentUser;
            let userToSeefollowing = userTosee.subscriptions.length;
            let userToSeefollowers = 0;
            for (let user of users) {
                if (user.username = sessionStorage.getItem('username')) {
                    currentUser = user;
                }
                if (userTosee.subscriptions.includes(userTosee.username)) {
                    userToSeefollowers++;
                }
            }

            $.ajax({
                method: 'GET',
                url: BASE_URL + 'appdata/' + APP_KEY + '/chirps',
                headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            }).then(async function (chirps) {
                let chirpsToLoad = [];
                for (let chirp of chirps) {
                    if (userTosee.username === chirp.author) {
                        chirpsToLoad.push(chirp);
                    }
                }
                if (JSON.parse(currentUser.subscriptions).includes(userTosee.username)) {
                    $('#btnFollow').text('Unfollow');
                } else {
                    $('#btnFollow').text('Follow');
                }
                $('#btnFollow').on('click', followOrUnfollow);
                showUserProfile();
                $('#userProfileName').text(userTosee.username)
                $($('#userProfileStats').children()[0]).text(chirpsToLoad.length + ' chirps');
                $($('#userProfileStats').children()[1]).text(userToSeefollowing + ' following');
                $($('#userProfileStats').children()[2]).text(userToSeefollowers + ' followers');

                let table = $('#profileChirps');
                table.empty();

                if (chirpsToLoad.length > 0) {
                    async function f() {

                        chirpsToLoad.forEach(el => {
                            el.time = calcTime(el._kmd.ect)
                        });
                        let userChirpsTemplates = await $.get('./templates/userChirps.hbs');
                        let userChirpsCompile = Handlebars.compile(userChirpsTemplates);
                        let contextProducts = {
                            chirps: chirpsToLoad
                        };
                        let compileHBStoHtml = userChirpsCompile(contextProducts);
                        table.append(compileHBStoHtml);

                        //attachEvents();
                    }

                    await f();
                } else {
                    table.append('<p>No chirps in database</p>');
                }
            }).catch(handleError)
        }).catch(handleError);
    }).catch(handleError);

}

function followOrUnfollow(event) {
    event.preventDefault();
    let btn = $(this).text();
    let userToFollowUnfollow = $($(this).parent().children()[0]).text();

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (user) {
        let username = user.username;
        let subscriptions = JSON.parse(user.subscriptions);
        if (btn === 'Follow') {
            subscriptions.push(userToFollowUnfollow);
            showInfo('Subscribed to ' + userToFollowUnfollow)
        } else {
            let index = subscriptions.indexOf(userToFollowUnfollow);
            subscriptions.splice(index, 1);
            showInfo('Unsubscribed from ' + userToFollowUnfollow)
        }
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {username: username, subscriptions: JSON.stringify(subscriptions)}
        }).then(function (res) {
            loadFeed();
        })
    }).catch(handleError);
}

function handleError(err) {
    let errorMsg = JSON.stringify(err);
    if (err.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if (err.responseJSON && err.responseJSON.description) {
        errorMsg = err.responseJSON.description;
    }
    showError(errorMsg);
}
