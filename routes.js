/*	  __        __      
     /\ \      /\ \ 
    /  \ \    /  \ \ 
   / /\ \ \  / /\ \ \ 
  / / /\ \ \/ / /\ \ \  
 / / /__\_\/ / /__\_\ \ 
/ / /______\/ /________\
\/_____________________/
APP: NATSYNAPSES
CODED BY: SUI GENERIS 
BY NEURONS ART AND TECHNOLOGY.
*/
//CHEATSHEET ROUTES HANDLERS

//NATSYNAPSES ROUTES
exports.home = function(req, res){res.render('pages/index')};
exports.cleaker = function(req, res){res.render('pages/cleaker')};
/*
 ,_   _,  __   _,  ___,_, 
 |_) / \,'|_) / \,' | (_, 
'| \'\_/ _|_)'\_/   |  _) 
 '  `'  '     '     ' '   
ROBOTS SECTION */
exports.welcomeRobots = function(req, res){
	res.type('text/plain');
    res.send("User-agent: *\nDisallow: ");};
//CODEMMANDS SECTION
exports.codemmands = function(req, res){res.render('pages/codemmands')};
exports.csPostgresql = function(req, res) {res.render('pages/codemmands_f/postgresql')};
exports.csHeroku = function(req, res) {res.render('pages/codemmands_f/heroku')};
exports.csPostgresHeroku = function(req, res) {res.render('pages/codemmands_f/postgresandheroku')};
exports.csMetasploit = function(req, res) {res.render('pages/codemmands_f/metasploit')};
exports.csNetcat = function(req, res){res.render('pages/codemmands_f/netcat')};
exports.viaJs = function(req, res){res.render('pages/codemmands_f/DOMjs')};
