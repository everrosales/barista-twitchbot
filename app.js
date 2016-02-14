var express = require('express');
var irc = require("tmi.js");

const http = require('http');

http.createServer( (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  var string = votePercentages.toString();
  response.end(string);
}).listen(3001);

console.log('Server running at http://127.0.0.1:3001/');

var messages = []
var votePercentages = [];

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
    }
    if(user.username == "barista16"){
      if(message.toLowerCase()=="#openvote"){
        voting = true;
      }else if(message.toLowerCase()=="#closevote"){
        voting = false;
        votePercentages = calculateVotes();
      }
    }
});

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

