var express = require("express");
var app = express();
var http = require("http");
var theServer = http.createServer(app); // create a server.
var theSocket = require("socket.io"); // create a socket.
var socketListener = theSocket.listen(theServer); // the socket has to listen to the server.
var port = process.env.PORT || 3000;
theServer.listen(port); // the server has to listen to a port..

app.get("/", function(req, res) // we send them the index html file one theyre connected..
{
	//console.log("CONNECTED");
	res.sendFile(__dirname+"/index.html");
});

socketListener.sockets.on("connection", function(socket) // when user turns on a connection event..
{
	socket.on("usersMessage", function(data) // first param is name of event, second event is what to execute for the event.
	{
		//console.log("the data sent to the server is "+data);
		socketListener.sockets.emit("thisUsersMessage", data); //  create a new event called thisUsersMessage and emit the data so everyone can see it..
	});
});