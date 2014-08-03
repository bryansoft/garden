var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor


var reconnect = null;
var sp = null;

var config = {};
config.serial = "COM3"

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

  console.log("DATA:" + data);
}

connect();