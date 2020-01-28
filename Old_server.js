
//BY SUI GENERIS NEURONS ART & TECHNOLOGY

//SETTING UP SERVER VARIABLES AND DEPENDENCIES
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var bodyParser = require("body-parser");
 //DATA BASE CONNECTION
const { Client } = require('pg');
const theVault = new Client({
  connectionString: "postgres://ytuydgrxxnommy:2f617ca7b4aa4a350e7944845efc9c24ccc7e9849dc4531ca7aa56b5923df417@ec2-107-20-177-161.compute-1.amazonaws.com:5432/d7gfkci480v21o",
  ssl: true,
});
theVault.connect();

const server = express()
	//SETTING UP ROUTING SPECS
 	.use(bodyParser.urlencoded({ extended: false }))
 	.use(bodyParser.json())
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')

	//ROUTING
	.get('/', (req, res) => res.render('pages/index'))

	//WTM-CHANNELS MANAGES THE INPUT FOR WTM-CHANNELS AND CREATES THE CONNECTIONS
	.get('/wtm-channels', (req, res) => res.render('pages/wtm-channels'))
	//GET 
	.post('/openChannel',function(req,res){
		const channel = req.body.channel; //INPUT CHANNEL 
		const channelHash = req.body.channelHash; //INPUT CHANNEL-HASH
		console.log(channel, channelHash); //JUST FOR DEVELOPMENT PURPOSES
		//Verifies if the channel doesn't already exists
		theVault.query('SELECT channel, channelhash FROM wtmchannels WHERE channel = $1 AND channelhash = $2', [channel, channelHash], (err, res) => {
			if(res.rowCount == 1){
				console.log("Si existe!");
				}else{
			 	//STORES DATA INTO WTM CHANNELS
		    	theVault.query('INSERT INTO wtmchannels (channel, channelhash) VALUES ($1, $2)', [channel, channelHash], (error, results) => {
		      	  if (error) {
		       	   throw error
		     	 		}
						console.log("New Channel saved!")
								})
							} //closes else
						}) // closes start of theVault query			
					}) //ENDS POST FUNCTION
					
	.get('/chat', (req, res) => res.render('pages/chat'))
	.listen(PORT, () => console.log(`Listening on ${ PORT } now`));
	
	//FOR DEVELOPMENT PURPOSES ONLY	
	theVault.query('SELECT * FROM wtmchannels', (err, res) => {
	if (err) throw err;
	for (let row of res.rows) {
	console.log(JSON.stringify(row));
	}
	
	});



//WEBSOCKET - CHAT SERVICES
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ server });
var uuid = require('node-uuid');
var clients = [];
function wsSend(type, client_uuid, nickname, message) {
  for(var i=0; i<clients.length; i++) {
    var clientSocket = clients[i].ws;
    if(clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify({
        "type": type,
        "id": client_uuid,
        "nickname": nickname,
        "message": message
      }));
    }
  }
}
var clientIndex = 1;
wss.on('connection', function(ws) {
  var client_uuid = uuid.v4();
  var nickname = "AnonymousUser"+clientIndex;
  clientIndex+=1;
  clients.push({"id": client_uuid, "ws": ws, "nickname": nickname});
  console.log('client [%s] connected', client_uuid);
  var connect_message = nickname + " has connected";
  wsSend("notification", client_uuid, nickname, connect_message);
  ws.on('message', function(message) {
    if(message.indexOf('/nick') === 0) {
      var nickname_array = message.split(' ');
      if(nickname_array.length >= 2) {
        var old_nickname = nickname;
        nickname = nickname_array[1];
        var nickname_message = "Client " + old_nickname + " changed to " + nickname;
        wsSend("nick_update", client_uuid, nickname, nickname_message);
      }
    } else {
      wsSend("message", client_uuid, nickname, message);
    }
  });
  var closeSocket = function(customMessage) {
    for(var i=0; i<clients.length; i++) {
        if(clients[i].id == client_uuid) {
            var disconnect_message;
            if(customMessage) {
                disconnect_message = customMessage;
            } else {
                disconnect_message = nickname + " has disconnected";
            }
          wsSend("notification", client_uuid, nickname, disconnect_message);
          clients.splice(i, 1);
        }
    }
  }
  ws.on('close', function() {
      closeSocket();
  });
  process.on('SIGINT', function() {
      console.log("Closing things");
      closeSocket('Server has disconnected');
      process.exit();
  });
});





