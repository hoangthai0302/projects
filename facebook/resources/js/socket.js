BASE_URL =document.location.protocol + "//" + document.location.host + "/facebook";
BASE_WS = "ws://" + document.location.host + "/facebook/websocket";
var ws;
$(document).ready(function(){
	ws = new WebSocket(BASE_WS);
	var userID = $('#userID').val();
	var token= $('#token').val();
	var message = {userID:userID, token:token};
	ws.onopen = function(event){
		
	    ws.send(JSON.stringify(message));
	    console.log('sent handshake');
	    console.log('token:' + token + '-id:' + userID);
	}




	
});

function bind(f){
	    ws.onmessage = function(event){
	        f(event);
	    }
	}
 
