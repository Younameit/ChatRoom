var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket);

    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
    });

    socket.on('message', function (message) {
        if(message.timestamp=='history') {
            var timestamp = $('<div class="timestamp"></div>').text(message.text.substring(0,21));
            var msg = $('<div class="message"></div>').text(message.text.substring(22));
            $('#messages').append(timestamp);
            $('#messages').append(msg);
        } else {
            var timestamp = $('<div class="timestamp"></div>').text(message.timestamp);
            $('#messages').append(timestamp);
            var newElement = $('<div class="message"></div>').text(message.text);
            $('#messages').append(newElement);
        }
    });


    $('#send-message').focus();

    $('#send-form').submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });
});

function divEscapedContentElement(message) {
    return $('<div class="message"></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div class="message"></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;

    var timestamp = getTimeStamp();

    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else if(message!=""){
        chatApp.sendMessage($('#room').text(), message, timestamp);
        $('#messages').append($('<div class="timestamp"></div>').text(timestamp));
        $('#messages').append(divEscapedContentElement(message));
        //what is scrollHeight? scrollTop?
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}

function getTimeStamp() {
    var d = new Date();
    var hr = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();

    hr = hr < 10 ? "0" + hr : hr;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    month = month < 10 ? "0" + month : month;

    var ampm = hr < 12 ? "AM" : "PM";

    var timestamp = month + "/" + date + "/" + year + " " + hr + ":" + min + ":" + sec + ampm;
    return timestamp;
}
