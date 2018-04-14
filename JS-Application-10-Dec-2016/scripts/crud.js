function loadMyMessages() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/messages',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showMyMessages();
        displayMessages(res);
    }).catch(handleError);

    async function displayMessages(messages) {
        let tableMessages = $('#myMessages tbody');
        tableMessages.empty();

        async function f() {

            //filter messages
            messages = messages.filter(el => el.recipient_username === sessionStorage.getItem('username'));

            if (messages.length > 0) {

                //format date and name
                messages.forEach(el => {
                    el.date = formatDate(el._kmd.ect);
                    el.fromName = formatSender(el.sender_name, el.sender_username);
                });

                let messagesTemplate = await $.get('./templates/myMessages.hbs');
                let messagesCompile = Handlebars.compile(messagesTemplate);
                let contextProducts = {
                    messages: messages
                };

                let compileHBStoHtml = messagesCompile(contextProducts);
                tableMessages.append(compileHBStoHtml);

            } else {
                tableMessages.append('<p>No messages</p>');
            }
        }

        await  f();
    }
}

function loadSentMessages() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/messages',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showSentMessages();
        displayEntMessages(res);
    }).catch(handleError);

    async function displayEntMessages(messages) {
        let tableMessages = $('#viewArchiveSent tbody');
        tableMessages.empty();

        async function f() {

            //filter messages
            messages = messages.filter(el => el.sender_username === sessionStorage.getItem('username'));
            if (messages.length > 0) {

                //format date and name
                messages.forEach(el => {
                    el.date = formatDate(el._kmd.ect);
                });
                let messagesTemplate = await $.get('./templates/sentMessages.hbs');
                let messagesCompile = Handlebars.compile(messagesTemplate);
                let contextProducts = {
                    messages: messages
                };

                let compileHBStoHtml = messagesCompile(contextProducts);
                tableMessages.append(compileHBStoHtml);
                attachEvents();

            } else {
                tableMessages.append('<p>No messages</p>');
            }
        }

        await  f();

        function attachEvents() {
            $('.deleteBtn').on('click', deleteMsg);
        }
    }
}

function deleteMsg() {
    let msgId = $(this).parent().parent().data().id;
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/messages/' + msgId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function () {
        showInfo('Message deleted.')
        loadSentMessages();
    }).catch(handleError)
}

function sendMessage() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showSendMessage();
        loadUsers(res);
    }).catch(handleError);

    function loadUsers(users) {
        let selector = $('#msgRecipientUsername');
        selector.empty();

        users.forEach(el => {
            el.toName = formatSender(el.name, el.username);
        });

        for (let user of users) {
            selector.append($(`<option>${user.toName}</option>`));
        }
    }
}

function sendMsg(event) {
    event.preventDefault();
    let selectedName = $('#msgRecipientUsername').find(':selected').val();
    selectedName = selectedName.split('(');
    let text = $('#msgText').val();
    let username = selectedName[0].trim();
    let sender = sessionStorage.getItem('username');
    let senderName = sessionStorage.getItem('name');

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/messages',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {sender_name: senderName, sender_username: sender, recipient_username: username, text: text}
    }).then(function () {
        $('#msgText').val('');
        showInfo('Message sent.');
        loadSentMessages();
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