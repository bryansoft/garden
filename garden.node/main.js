var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var server = process.argv[2];
var port = process.argv[3];
var node = process.argv[4];

console.log("SERVER = " + server);
console.log("PORT = " + port);
console.log("NODE = " + node);

var sp = new SerialPort("COM3", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});
process.on('uncaughtException', function(e){
  console.error("uncaught: " + e);
})

sp.on("data", function (data) {

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
});