var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var restler = require("restler");

process.on('uncaughtException', function(e){
  console.error("uncaught: " + e);
  if(e.toString().indexOf("Disconnected") >= 0 || e.toString().indexOf("Opening ") >= 0){
    serialError();
  }
})


function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}


fs.readFile(process.argv[2], 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var config = JSON.parse(data);

  console.log("SERVER = " + config.server);
  console.log("PORT = " + config.port);
  console.log("NODE = " + config.node);
  console.log("SERIAL = " + config.serial);
  console.log("CAMERA = " + config.camera);

  function takePicture(){
    fs.exists("image.jpeg", function(exists){
      exists ? fs.unlink("image.jpeg", doPic) : doPic();
      function doPic(){
        console.log("Taking picture...")
        var child = exec('streamer -f jpeg -o image.jpeg -s 2048x1536 -c ' + config.camera);
        child.stdout.pipe(process.stdout)
        child.on('exit', function() {
          fs.stat("image.jpeg", function(err, stats) {
            if(err){
              return setTimeout(takePicture, 15 * 60 * 1000);
            }
            var id = uuid();
            var time = new Date().getTime();
            console.log("Picture call complete. Sending picture to server...");
            console.log("Image label = " + id)
            console.log("Time = " + new Date(time));
            restler.post("http://" + config.server + ":" + config.port + "/rest/snapshot", {
              multipart: true,
              data: {
                "uuid": id,
                "time": time,
                "image": restler.file("image.jpeg", null, stats.size, null, "image/jpg")
              }
            })
            .on("error", scheduleNextPicture)
            .on("complete", function(data) {
              console.log("File uploaded. Local file...");
              fs.unlink("image.jpeg", scheduleNextPicture);
              console.log(data);
            });
          });
        });
      }
    })
  }

  function scheduleNextPicture(){
    setTimeout(takePicture, 15 * 60 * 1000);
  }

  takePicture();

  var sp = null;
  var reconnect = null;

  function connect(){
    console.log("Opening serial port on " + config.serial);
    sp = new SerialPort(config.serial, {
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
      json.node = config.node;
      try{
        // Build the post string from an object
        var post_data = querystring.stringify(json);

        // An object of options to indicate where to post to
        var post_options = {
          host: config.server,
          port: config.port,
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
});
