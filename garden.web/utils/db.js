
var log = require("./log").create("DB");
var cradle = require('cradle');
var _ = require("underscore");

var c = new(cradle.Connection)('http://localhost', 5984, {
  cache: true,
  raw: false,
  forceSave: true
});

var db = c.database('garden');
db.exists(function (err, exists) {
  if (err) {
    log.error('error', err);
  } else if (exists) {
    log.info('the force is with you.');
  } else {
    log.info('database does not exists.');
    db.create(function (err){
      if(err){
        log.error("Failed to create database: " + JSON.stringify(err))
      }
    });
  }
});
db.save('_design/measurements', {
  views: {
    all: {
      map: function (doc) {
        if (doc.type === 'measurement') {
          emit(doc.uuid, doc)
        }
      }
    },
    sorted: {
      map: function (doc) {
        if (doc.type === 'measurement') {
          emit(doc.time, doc)
        }
      }
    }
  }
})

module.exports = {
  latestMeasurements: function(callback){
    log.info("Querying measurements");
    db.view("measurements/sorted", {limit:10000, descending:true}, function(err, results){
      if(err){
        log.info("Failed to fetch latest measurements: " + JSON.stringify(err));
      }
      callback(err, _.collect(results, function(r){
        return r.value;
      }))
    });
  },
  nextLatestMeasurements: function(endKey, callback){
    log.info("Querying measurements by endkey");
    db.view("measurements/sorted", {limit:10, descending:true, startkey: endKey - 1, endkey:0}, function(err, results){
      if(err){
        log.info("Failed to fetch latest measurements by key: " + endKey + " : " + JSON.stringify(err));
      }
      callback(err, _.collect(results, function(r){
        return r.value;
      }))
    });
  },
  saveMeasurement: function(report, callback){
    report.type = "measurement";
    db.save(report.uuid, report, callback);
  },
  saveSnapshot: function(snapshot, callback){
    snapshot.type = "snapshot";
    db.save(snapshot.uuid, snapshot, callback);
  },
  getSnapshot: function(uuid, callback){
    db.get(uuid, callback);
  }
}

