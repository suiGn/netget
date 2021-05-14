/** SERVER APP: netget **
*** CODED BY SUI GENERIS NEURONS ART & TECHNOLOGY ****/
const forceSecure = require("force-secure-express");
const express = require('express');
const path = require('path');
var session = require('express-session');
const PORT = process.env.PORT || 3000;
//const PORT = 31416; //Cleaking
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var bodyParser = require("body-parser");
const routes = require('./routes');
const monadLisa_art = require('./configs/details');
const method = require('./methods');
var unicorn = "🍺🦄🍺";
var uuid = require('node-uuid');
const { Client } = require('pg');

const theVault = new Client({
connectionString: "postgres://actrqichtajnmf:909f1306da4d36e65b81649e6677d30ae8e55a57925b0e501a0c1642e58d80bd@ec2-34-194-215-27.compute-1.amazonaws.com:5432/dhfui1h48dc48",
ssl: { rejectUnauthorized: false }
});
theVault.connect();


const server = express()
	//SETTING UP ROUTING SPECS
 	.use(bodyParser.urlencoded({ extended: false }))
 	.use(bodyParser.json())
	.use(forceSecure(["monadlisa.com","wwww.monadlisa.com"])) // FORCE SSL
	.use(express.static(path.join(__dirname, 'web/public')))
	.set('views', path.join(__dirname, 'web/views'))
	.set('view engine', 'ejs')
	//ROUTING Cleaker 
	.get('/', routes.home)
	.get('/codemmands', routes.codemmands)
	.get('/cs-postgresql', routes.csPostgresql)
	.get('/cs-heroku', routes.csHeroku)
	.get('/cs-postgresandheroku', routes.csPostgresHeroku)
	.get('/cs-metasploit', routes.csMetasploit)
	.get('/cs-netcat', routes.csNetcat)
	.get('/client-information-javascript', routes.viaJs)
	/*
 	,_   _,  __   _,  ___,_, 
 	|_) / \,'|_) / \,' | (_, 
   '| \'\_/ _|_)'\_/   |  _) 
 	'  `'  '     '     ' '   
	ROBOTS SECTION */
	.get('/robots.txt', routes.welcomeRobots)
	// Route not found (404)
	.use(function(req, res, next) {
  	  return res.status(404).render('pages/404')
	})
	//Any error
	.use(function(err, req, res, next) {
  	  return res.status(500).send({ error: err })
	})

	.listen(PORT, () => console.log(`                      
	  netget         
       On:${PORT}     

			`));
			
			//      _ ___   _  _  __
			//  |V||_  ||_|/ \| \(_ 
			//  | ||__ || |\_/|_/__)	
			
				function brdCstRight(room, obj){ //broadcast to room membrs Only
				var BroadCastMembers = [ ];
		     	//Filters only members belonging to the same room
				const members = allMembers.filter(goes => goes.channel === channel);
				//Once filtered to only same room members to broadcast
				members.forEach(function(element) {BroadCastMembers.push(element.client);});
				// broadcast message to all connected clients in room
				BroadCastMembers.forEach(function(EndClient){EndClient.sendUTF(obj);});	
					};
				
			/** Helper function for escaping input strings */
			function htmlEntities(str) {
				return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
							      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
									}			
									// Array with some colors
									var colors = [ '#a8d069', '#30ad64', '#25ccbf', '#20ac99', '#f8c740', '#e2a62b',
									 '#face6a', '#e4b962', '#fd7072', '#cf404d', '#d39f9a', 
									'#735260', '#af4173', '#822e50', '#e64c40', '#bf3a30','#fc7d64','#49647b'];
			// ... in random order
			colors.sort(function(a,b) { return Math.random() > 0.5; } );
	
				

				
		   /** 				  o       o                                
							  |       |                               
							  o   o   o  
	 	   					   \ / \ / 
	 	   					    o   o  */
			/*_      _____ ___ ___  ___   ___ _  _____ _____ 
			 \ \    / / __| _ ) __|/ _ \ / __| |/ / __|_   _|
		      \ \/\/ /| _|| _ \__ \ (_) | (__| ' <| _|  | |  
			   \_/\_/ |___|___/___/\___/ \___|_|\_\___| |_|
					serverside websocket managment **/
		
			var webSocketServer = require('websocket').server;
			var clientsON = [ ];
			var allClients = [ ];
		
			var wsServer = new webSocketServer({
		    httpServer: server
				});
		//exports.wsServer;
		// WebSocket server Starts from Here
		wsServer.on('request', function(request) {
			
				   var uuid_numbr = uuid.v4();
				   var connection = request.accept(); //connecting from same website
				   var index = clientsON.push(connection) - 1; //client index to remove them on 'close' event
				   console.log('1. Connection Accepted UUID: ' + uuid_numbr + ' Request.Origin: ' + request.origin);
				   
				   //starts - comunication with user - connection.on 
				   connection.sendUTF(JSON.stringify({ type:'cleaking', uuid: uuid_numbr})); // 'cleaking' -- handshake innitiation
				   //Listening - on incoming comunication
					  connection.on('message', function(message) {
						if (message.type === 'utf8') { //IF TEXT. 
							msg = JSON.parse(message.utf8Data); //parse to json
							if (msg.code === 'init') { //Create rooms for Broadcast Redirection and Initiation
		   					var client = {
		   						channel: msg.channel,
		   						index: index,
		   						connection: connection,
								uuid: uuid_numbr
							}		
		   			//Push into the array
					allClients.push(client);
					} 
					
					
					
					else if (msg.code === 'onCleaker'){ //CLEAKER NETWORK MONITORING
					//packet - send INFORMATION TO RUNME
					var activeUser = JSON.stringify({ type: "clkr_Start", cleaker: msg.cleaker});
					//console.log(pckr.cleaker);
					brdCstRight("runmeMasterMind", activeUser);
							} //ACTIVE USERS - RUNME CLOSURE
							


					else if (msg.param0 === 0){ // TIMER TO KEEP SESSIONS ALIVE
							//console.log("keepme");
					 	 	var stayingAlive = JSON.stringify({ type: "stayingAlive", chorus: "A A A A"});
					 	 	brdCstRight("Clients", stayingAlive);
							}// KEEP ME ALIVE CLOSURE
						
		

							}//IF MESSAGE.TYPE CLOSURE
									});//END CONNECTION.ON MESSAGE		
															
					// User disconnected
					connection.on('close', function(connection) {
							//console.log(".disconnected - UUID:" + uuid_numbr);//logoutRecord
							clientsON.splice(index, 1);// remove user from the list of connected clients
							}); 
						}); // FINISHES WEB SERVER ON
