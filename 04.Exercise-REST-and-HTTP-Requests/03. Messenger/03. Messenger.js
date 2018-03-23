function attachEvents() {
    let url = `https://messanger-1f3fa.firebaseio.com/messanger.json`;
    
    $('#refresh').on('click', loadMessages);
    loadMessages();
    
    $('#submit').on('click', sendMessage);
    
    function sendMessage() {
        let name = $('#author');
        let content = $('#content');

        if(name.val().length === 0){
            return;
        }

        let objMessage = JSON.stringify({author: name.val(), content: content.val(), timestamp: Date.now()});

        $.ajax({
            method: 'POST',
            url: url,
            data: objMessage,
            success: addText,
            error: showError
        });

        function addText() {
            $('#messages').append(`${name.val()}: ${content.val()}`);
            $('#content').val('');
        }
    }

    function loadMessages() {
        $.ajax({
            method: 'GET',
            url: url,
            success: showMessages,
            error: showError,
        });
        function showMessages(res) {
            $('#messages').empty();
            let messages = [];
            for(let msg in res){
                messages.push(res[msg]);
            }
            let sortedMessages = messages.sort((a, b)=>a.timestamp - b.timestamp);
            for(let msg of sortedMessages){
                $('#messages').append(`${msg.author}: ${msg.content}\n`)
            }
        }
    }

    function showError(err) {
        console.log(err);
    }
}