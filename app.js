var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var irc = require("tmi.js");
var WebSocket = require('ws');

var index = require('./routes/index');
var http = require('http');

var server = http.createServer( (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  var string = votePercentages.toString();
  response.end(string);
});
server.listen(process.env.PORT || 3001);

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

console.log('Server running at http://127.0.0.1:3001/');
app.use('/', index);

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
  httpServer: server
});

ws = new WebSocket('ws://' + "18.111.63.105" + ':1234', 'echo-protocol');
console.log(ws);


var updateInterface = function(msgString) {

};

var clients = {};
var count = 0;

var messages = []
var votePercentages = [];

wsServer.on('request', function(r) {
  var connection = r.accept('echo-protocol', r.origin);
  var id = count++;
  clients[id] = connection;
  votePercentages = calculateVotes();
  for (var c in clients) {
    clients[c].sendUTF(JSON.stringify(votePercentages));
  }
  console.log((new Date()) + ' Connection accepted [' + id + ']');
  connection.on('message', function() {
    var msgString = message.utf8Data;

    console.log('Recieved msg: ' + msgString + ', by client: ' + id);
  });

  connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "chat",
        reconnect: true
    },
    channels: ["#barista16"]
};

var client = new irc.client(options);
var voting = false;
var drink1votes = 0;
var drink2votes = 0;
var drink3votes = 0;
var drink4votes = 0;
// Connect the client to the server..
client.connect();
client.on("chat", function (channel, user, message, self) {
    messages.push(message);
    if(voting){
      if(message.toLowerCase()=="#drink1"){
        drink1votes++;
      }else if(message.toLowerCase()=="#drink2"){
        drink2votes++;
      }else if(message.toLowerCase()=="#drink3"){
        drink3votes++;
      }else if(message.toLowerCase()=="#drink4"){
        drink4votes++;
      }
      votePercentages = calculateVotes();
      for (var c in clients) {
        clients[c].sendUTF(JSON.stringify(votePercentages));
      }
    }
    if(user.username == "barista16"){
      if(message.toLowerCase()=="#openvote"){
        voting = true;
      }else if(message.toLowerCase()=="#closevote"){
        voting = false;
        votePercentages = calculateVotes();
        createDrink(votePercentages);
      }
    }
});

var createDrink = function(votes) {
  mixObject = {
    type: 'mix',
    recipe: {'a': votes[0], 'b': votes[1], 'c': votes[2], 'd': votes[3], 'e': 0},
    amount: 1,
    name: 'Twitch Bot'
  }
  console.log(mixObject);
  console.log(ws.OPEN);
  ws.send(JSON.stringify(mixObject));
}

var calculateVotes = function(){
    var totalVotes = drink1votes + drink2votes + drink3votes + drink4votes;
    var percentage1 = Math.round((drink1votes*1.0/totalVotes)*10)/10.0;
    var percentage2 = Math.round((drink2votes*1.0/totalVotes)*10)/10.0;
    var percentage3 = Math.round((drink3votes*1.0/totalVotes)*10)/10.0;
    var percentage4 = Math.round((drink4votes*1.0/totalVotes)*10)/10.0;
    return [percentage1, percentage2, percentage3, percentage4];
}

client.on("clearchat", function (channel) {
    drink1votes = 0;
    drink2votes = 0;
    drink3votes = 0;
    drink4votes = 0;
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
