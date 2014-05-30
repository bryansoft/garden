var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var server = process.argv[2];
var port = process.argv[3];
var node = process.argv[4];
var serial = process.argv[5];

console.log("SERVER = " + server);
console.log("PORT = " + port);
console.log("NODE = " + node);
console.log("SERIAL = " + serial);

var sp = null;
var reconnect = null;

process.on('uncaughtException', function(e){
  console.error("uncaught: " + e);
  if(e.toString().indexOf("Disconnected") >= 0 || e.toString().indexOf("Opening ") >= 0){
    serialError();
  }
})

function connect(){
  console.log("Opening serial port on " + serial);
  sp = new SerialPort(serial, {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
  });
  sp.on("error", serialError);
  sp.on("data", serialData);
}

function serialError(){
  if(reconnect){
    clearTimeout(reconnect);
    reconnect = null;
  }
  console.log("Error on serial port. Reconnecting in 3 seconds...");
  reconnect = setTimeout(function(){
    connect()
  },3000);
}

function serialData(data){

  process.nextTick(function(){
    console.log("Parsing json...")
    var json = JSON.parse(data);
    console.log("Parsed!");
    json.node = node;
    try{
      // Build the post string from an object
      var post_data = querystring.stringify(json);

      // An object of options to indicate where to post to
      var post_options = {
        host: server,
        port: port,
        path: '/rest/measurement',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
        }
      };

      // Set up the request
      var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end()
    }
    catch(e){
      console.error("Failed to post: " + e);
    }
  });
  console.log("here: "+data);
}

connect();