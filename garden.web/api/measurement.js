
var logger = require("../utils/log");
var db = require("../utils/db")

module.exports = function(server){
  server.post("/rest/measurement", function(req,res){
    var log = logger.create("POST-MEASUREMENT")
    var report = req.body;
    report.time = new Date().getTime();
    log.info("Received measurement: " + JSON.stringify(report));
    db.saveMeasurement(report, function (err, result) {
      if (err) {
        res.send(404);
        return log.error('error running query ' + JSON.stringify(err));
      } else {
        log.info("Measurement saved successfully");
        res.send(200);
      }
    })
  })
  server.get("/rest/measurement/latest", function(req,res){
    var log = logger.create("GET-MEASUREMENT-LATEST")
    log.info("Querying the latest measurements")
    db.latestMeasurements(function(err, measurements){
      log.info("Queried measurements");
      res.send(measurements);
    });
  })
  server.get("/rest/measurement/byHour", function(req,res){
    var log = logger.create("GET-MEASUREMENT-LATEST-BYHOUR")
    log.info("Querying the latest measurements")
    db.latestMeasurementsByHour(function(err, measurements){
      log.info("Queried measurements");
      res.send(measurements);
    });
  })
  server.get("/rest/measurement/latest/:endKey", function(req,res){
    var log = logger.create("GET-MEASUREMENT-LATEST")
    var endKey = req.param("endKey");
    log.info("Querying the latest measurements with key: " + endKey)
    db.nextLatestMeasurements(endKey, function(err, measurements){
      log.info("Queried measurements");
      res.send(measurements);
    });
  })
}