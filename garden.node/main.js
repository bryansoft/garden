var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;

var server = process.argv[2];
var port = process.argv[3];
var node = process.argv[4];
var serial = process.argv[5];
var camera = process.argv[5];

console.log("SERVER = " + server);
console.log("PORT = " + port);
console.log("NODE = " + node);
console.log("SERIAL = " + serial);
console.log("CAMERA = " + camera);

function takePicture(){
  fs.exists("image.bmp", function(exists){
    exists ? fs.unlink("image.jpeg", doPic) : doPic();
    function doPic(){
      var child = exec('streamer -f jpeg -o image.jpeg -c ' + camera);
      child.stdout.pipe(process.stdout)
      child.on('exit', function() {
        fs.rename("image.jpeg", new Date().getTime() + ".png", function(){
          setTimeout(takePicture, 15 * 60 * 1000);
        })
      });
    }
  })
}

takePicture();


//var fs = require('fs');
//var imageStream = fs.createWriteStream('capture.jpg');
//imagesnap().pipe(imageStream);

//var Camelot = require('camelot');
//
//var camelot = new Camelot( {
//  'rotate' : '180',
//  'flip' : 'v'
//});
//
//camelot.on('frame', function (image) {
//  console.log('frame received!');
//});
//
//camelot.on('error', function (err) {
//  console.log(err);
//});
//
//camelot.grab( {
//  'title' : 'Camelot',
//  'font' : 'Arial:24',
//  'frequency' : 1
//});

//var sp = null;
//var reconnect = null;
//
//process.on('uncaughtException', function(e){
//  console.error("uncaught: " + e);
//  if(e.toString().indexOf("Disconnected") >= 0 || e.toString().indexOf("Opening ") >= 0){
//    serialError();
//  }
//})
//
//function connect(){
//  console.log("Opening serial port on " + serial);
//  sp = new SerialPort(serial, {
//    baudrate: 9600,
//    parser: serialport.parsers.readline("\n")
//  });
//  sp.on("error", serialError);
//  sp.on("data", serialData);
//}
//
//function serialError(){
//  if(reconnect){
//    clearTimeout(reconnect);
//    reconnect = null;
//  }
//  console.log("Error on serial port. Reconnecting in 3 seconds...");
//  reconnect = setTimeout(function(){
//    connect()
//  },3000);
//}
//
//function serialData(data){
//
//  process.nextTick(function(){
//    console.log("Parsing json...")
//    var json = JSON.parse(data);
//    console.log("Parsed!");
//    json.node = node;
//    try{
//      // Build the post string from an object
//      var post_data = querystring.stringify(json);
//
//      // An object of options to indicate where to post to
//      var post_options = {
//        host: server,
//        port: port,
//        path: '/rest/measurement',
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/x-www-form-urlencoded',
//          'Content-Length': post_data.length
//        }
//      };
//
//      // Set up the request
//      var post_req = http.request(post_options, function(res) {
//        res.setEncoding('utf8');
//        res.on('data', function (chunk) {
//          console.log('Response: ' + chunk);
//        });
//      });
//
//      // post the data
//      post_req.write(post_data);
//      post_req.end()
//    }
//    catch(e){
//      console.error("Failed to post: " + e);
//    }
//  });
//  console.log("here: "+data);
//}
//
//connect();