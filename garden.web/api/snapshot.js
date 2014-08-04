
var logger = require("../utils/log");
var dirs = require("../utils/dirs");
var db = require("../utils/db")
var fs = require("fs");
var path = require("path");

module.exports = function(server){
  server.post("/rest/snapshot", function(req, res){
    var log = logger.create("POST-SNAPSHOT")
    var uuid = req.body.uuid;
    var time = req.body.time;
    log.info("Received picture: " + uuid + " - " + time);
    db.saveSnapshot({uuid:uuid, time:time}, function (err) {
      if (err) {
        log.error("Error saving the snapshot: " + JSON.stringify(err));
        res.send(500);
      } else {
        log.info("Recorded the picture in the database")
        fs.rename(req.files.image.path, path.resolve(dirs.images, time + "-" + uuid + ".jpg"), function(err) {
          if (err)
            return log.error("Error writing the snapshot to the images folder: " + err);
          log.info("Saved the file: " + path.resolve(dirs.images, time + "-" + uuid + ".jpg"))
          res.send(200)
        })
      }
    });
  })
  server.get("/rest/snapshot/:id/image.jpeg", function(req, res){
    var log = logger.create("GET-SNAPSHOT");
    var uuid = req.param("id");
    log.info("Fetching snapshot: " + uuid)

    db.getSnapshot(uuid, function(err, doc){
      if(err){
        log.info("Failed to load snapshot for reason: " + err);
        res.write('404 Not Found\n');
        res.end();
        return;
      }
      var file = dirs.images + "/" + doc.time + "-" + uuid + ".jpg";
      log.info("Piping: " + file + " to client");
      res.writeHead(200, "image/jpeg");

      var fileStream = fs.createReadStream(file);
      fileStream.pipe(res)
    })
  })

}