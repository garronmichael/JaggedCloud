// require dependencies
var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var db = require('./db/config.js');
var fs = require('fs');
var port = process.env.PORT || 3000;
var httpsPort = 8000;

var app = express();
require('./routes')(app, express);

var options = {
  key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
};

https.createServer(options, app).listen(httpsPort, function(){
    console.log('https server listening on port', httpsPort);
});

var server = http.createServer(app).listen(port, function() {
  console.log('Server listening on port', port);
});

//Sockets Setup
//io is the overall connection
//Within io you can have many specific channels/pipes which are called sockets
//We listen for specific events on sockets
//We can also send events to ALL sockets via io.emit
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  console.log('a user connected');
  io.emit('greeting', 'HELLO WORLD heres some data from sockets!');
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
  socket.on('coords', function(data) {
    socket.broadcast.emit('coordinates', data);
  });
});
