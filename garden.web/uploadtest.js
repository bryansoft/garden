var fs = require("fs");

var restler = require("restler");


var id = "test";
var time = new Date().getTime();

fs.stat("test.jpeg", function(err, stats) {
  restler.post("http://localhost:8081/rest/snapshot", {
    multipart: true,
    data: {
      "uuid": id,
      "time": time,
      "image": restler.file("test.jpeg", null, stats.size, null, "image/jpg")
    }
  })
    .on("error", function(){
      console.log("error");
    })
    .on("complete", function(data) {
      console.log("File uploaded. Local file...");
      console.log(data);
    });
});