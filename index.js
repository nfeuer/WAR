var express = require("express");
var app = express();
var http = require("http");
var theServer = http.createServer(app); // create a server.
var theSocket = require("socket.io"); // create a socket.
var socketListener = theSocket.listen(theServer); // the socket has to listen to the server.
var port = process.env.PORT || 3000;
theServer.listen(port); // the server has to listen to a port..

app.use(express.static('public/public/sources'));
app.get("/", function(req, res) // we send them the index html file one theyre connected..
{
    // console.log(__dirname);
    
    // res.sendFile(__dirname+"/index.html");
    
});

var player1Health = 100;
var player2Health = 100;
var player1Sheild = false;
var player2Sheild = false;
var connectedPlayers = [];
var game = true;

function executeAction(spell,playerId) {
	var player = connectedPlayers.indexOf(playerId);
	if(!player) {
		console.log("player broke");
		console.log(player);
		return;
	}
	
	switch(spell) {
		case 'sheild':
			if(player % 2 == 0) {
				player1Sheild = true;
			} else {
				player2Sheild = true;
			}
		break;
		case 'basic attack':
			if(player % 2 == 0) {
				if(!player2Sheild) {
					player2Health -= 30;
					checkHealth(player2Health,0);
				} else {
					player2Sheild = !player2Sheild;
				}
			} else {
				if(!player1Sheild) {
					player1Health -= 30;
					checkHealth(player1Health,1);
				} else {
					player1Sheild = !player1Sheild;
				}
			}
		break;
		case 'super attack':
			if(player % 2 == 0) {
				if(!player2Sheild) {
					player2Health -= 50;
					checkHealth(player2Health,0);
				} else {
					player2Sheild = !player2Sheild;
				}
			} else {
				if(!player1Sheild) {
					player1Health -= 50;
					checkHealth(player1Health,1);
				} else {
					player1Sheild = !player1Sheild;
				}
			}
		break;	
		default :
		break;
	}
}

function checkHealth(health, player) {
	if(health <= 0) {
		//game = false;
		win(player);
	}
}

function win(who) {
	player1Health = 100;
	player2Health = 100;
	player1Sheild = false;
	player2Sheild = false;
	for(var i = who % 2; i < connectedPlayers.length; i += 2) {
		connectedPlayers[i].emit('win');
		if(who % 2 == 0 && i+1 < connectedPlayers.length) {
			connectedPlayers[i+1].emit('end', {all:connectedPlayers.length});
		} else if(who % 2 == 1 && i-1 != -1) {
			connectedPlayers[i-1].emit('end', {all:connectedPlayers.length});
		}
	}
	
	
	//game = true;
}

socketListener.sockets.on('connection', function(socket) 
{
	console.log("Connection");
	console.log("Players: " + connectedPlayers.length);
	connectedPlayers.push(socket);

	socket.on('action', function(data) 
	{
		executeAction(data.spell,socket);
	});

	socket.on('disconnect', function() {
		var i = connectedPlayers.indexOf(socket);
		connectedPlayers.splice(i,1);
		console.log("disconnected");
		console.log(connectedPlayers.length);
		//socket.broadcast('end');
	});
});