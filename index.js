/** SERVER APP: netget **
*** CODED BY SUI GENERIS NEURONS ART & TECHNOLOGY ****/

//Module dependencies
var express = require('express');
const path = require('path');
var app = express();
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var bodyParser = require("body-parser");
var routes = require('./routes');

module.exports = app;

 	//DATA BASE CONNECTION
	const { Client } = require('pg');
	const theVault = new Client({
 	   connectionString: "postgres://ytuydgrxxnommy:2f617ca7b4aa4a350e7944845efc9c24ccc7e9849dc4531ca7aa56b5923df417@ec2-107-20-177-161.compute-1.amazonaws.com:5432/d7gfkci480v21o",
  	 	ssl: true,
		});
		theVault.connect();
		
	//SETTING UP ROUTING SPECS
 	app.use(bodyParser.urlencoded({ extended: false }))
 	app.use(bodyParser.json())
	app.use(express.static(path.join(__dirname, 'public')))
	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs')
		//ROUTING
		app.get('/', routes.home);
	   /*
	    ,_   _,  __   _,  ___,_, 
	    |_) / \,'|_) / \,' | (_, 
	   '| \'\_/ _|_)'\_/   |  _) 
	    '  `'  '     '     ' '   
	   	ROBOTS SECTION */
		app.get('/robots.txt', routes.welcomeRobots);
		//Developement Purposes
		app.get('/cool', function (req, res) {
		  res.send('cool is working!');
		});	
		//CODEMMANDS SECTION
		app.get('/codemmands', routes.codemmands);
		app.get('/cs-postgresql', routes.csPostgresql);
		app.get('/cs-heroku', routes.csHeroku);
		app.get('/cs-postgresandheroku', routes.csPostgresHeroku);
		app.get('/cs-metasploit', routes.csMetasploit);
		app.get('/cs-netcat', routes.csNetcat);
		app.get('/client-information-javascript', routes.viaJs);

		// Route not found (404)
		app.use(function(req, res, next) {
		  return res.status(404).render('pages/404')
		});
		
		// Any error
		app.use(function(err, req, res, next) {
		  return res.status(500).send({ error: err });
		});
						

		

 
 
 app.listen(PORT, () => console.log(`    
	 .__________________________.
    | .___________________. |==|
	| |                   | |  |
    | |      Neurons      | |  |
    | |       Art         | |  |
    | |        &          | |  |
    | |       Tech        | |  |
    | |                   | |  |
    | |         On:${PORT}     |
    | |        netget	  | | ,|
    | !___________________! |(c|
    !_______________________!__!
    |    ___ -=      ___ -= | ,|
    | ---[_]---   ---[_]--- |(c|
    !_______________________!__!
				`));
						


