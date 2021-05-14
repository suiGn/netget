const fs = require('fs');
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();


client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});


client.on('connect', function(connection) {
    console.log('Connected to NetGet ws Server.');
	connection.send(JSON.stringify({code: 'init' , channel: "Clients", param0: "0"}));
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
	
    connection.on('close', function() {
        console.log('Connection Closed');
    });
	
			
connection.on('message', function(message) {
   if (message.type === 'utf8') {
       console.log("Received: '" + message.utf8Data + "'");
     }
    });
    
	
	
});

client.connect('ws://localhost:5000/');

