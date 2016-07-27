    var websocket = null;

    var wsURI = 'ws://127.0.0.1:8080/drools-fiddle/websocket/log';
    websocket = new WebSocket(wsURI);

    websocket.onopen = function() {
        console.log('Open');
        document.getElementById('sayHello').disabled = false;
        displayMessage('Connection is now open. Type a name and click Say Hello to send a message.');
    };
    websocket.onmessage = function(event) {
        // log the event
        displayMessage('The response was received! ' + event.data, 'success');
    };
    websocket.onerror = function(event) {
        // log the event
        displayMessage('Error! ' + event.data, 'error');
    };
    websocket.onclose = function() {
        console.log('Closed');
        displayMessage('The connection was closed or timed out. Please click the Open Connection button to reconnect.');
        document.getElementById('sayHello').disabled = true;
    };

    function disconnect() {
        if (websocket !== null) {
            websocket.close();
            websocket = null;
        }
        message.setAttribute("class", "message");
        message.value = 'WebSocket closed.';
        // log the event
    }

    function sendMessage() {
        if (websocket !== null) {
            var content = document.getElementById('name').value;
            websocket.send(content);
        } else {
            displayMessage('WebSocket connection is not established. Please click the Open Connection button.', 'error');
        }
    }

    function displayMessage(data, style) {
        var message = document.getElementById('log');
        message.value = message.value + "\n" + data;
    }


