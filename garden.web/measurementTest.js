var fs = require("fs");
var querystring = require("querystring");
var http = require('http');


var id = "test";
var time = new Date().getTime();

var json = {
  temperature:530,
  moisture:1024
}

// Build the post string from an object
var post_data = querystring.stringify(json);

// An object of options to indicate where to post to
var post_options = {
  host: "localhost",
  port: "8081",
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