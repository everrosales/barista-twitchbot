const http = require('http');

http.createServer( (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  var string = "";
  for(var i=0; i<messages.length; i++){
      string+=messages[i] + "\n";
  }
  response.end(string);
}).listen(3001);

console.log('Server running at http://127.0.0.1:3001/');

var irc = require("tmi.js");

var messages = []

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

// Connect the client to the server..
client.connect();
client.on("chat", function (channel, user, message, self) {
    messages.push(message);
    if(message.toLowerCase()=="#drink1"){
        console.log("DRINK1");
    }
});