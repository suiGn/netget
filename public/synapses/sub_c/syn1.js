function onLoad(){
    var theDate = new Date();
    console.log('Current date: ' + theDate);
	  }
	  onLoad();
	  
	 	  //STARTING WEBSOCKETS - SET DATA READY
	  	 //USE URL WS:// OR WSS:// (IF USING TLS)
	   	var ws = new WebSocket("wss://cleaker.herokuapp.com");
	  	//var ws = new WebSocket("ws://localhost:5000"); //RUNNING LOCAL
	  	  	ws.onopen = function(e){
	   			console.log("On ");
	 			document.getElementById("onStat").style.color = "#09ffe2";
	   	
	 					}
	  } 				