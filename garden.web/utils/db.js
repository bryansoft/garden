
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
    },
    byHour: {
      // map
      map: function(doc){
        emit(Math.round(parseFloat(doc.time)/60 * 60 * 1000), parseFloat(doc.moisture)) // in place of doc.info.size, you'd put whatever
        // value you want averaged here
      },
      // reduce
      reduce: function(keys, values, rereduce) {
        if (!rereduce){
          var length = values.length
          return [sum(values) / length, length]
        }else{
          var length = sum(values.map(function(v){return v[1]}))
          var avg = sum(values.map(function(v){
            return v[0] * (v[1] / length)
          }))
          return [avg, length]
        }
      }
//      map: function (doc) {
//        if (doc.type === 'measurement') {
//          emit(Math.floor(doc.time/1000), parseFloat(doc.moisture));
//        }
//      },
//      reduce: function(keys, values){
//        return sum(values)/values.length;
//      }
    }
  }
})
db.save('_design/snapshots', {
  views: {
    all: {
      map: function (doc) {
        if (doc.type === 'snapshot') {
          emit(doc.uuid, doc)
        }
      }
    },
    sorted: {
      map: function (doc) {
        if (doc.type === 'snapshot') {
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
  latestMeasurementsByHour: function(callback){
    log.info("Querying measurements by endkey");
    db.view("measurements/byHour", {group:true, limit:1000, descending:true}, function(err, results){
      log.info("Results came back...")
      if(err){
        log.info("Failed to fetch latest measurements by key: " + JSON.stringify(err));
      }
      callback(err, _.collect(results, function(r){
        return r;
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
  },
  getSnapshots: function(callback){
    db.view("snapshots/sorted", {}, function(err, results){
      if(err){
        log.info("Failed to fetch snapshots: " + JSON.stringify(err));
      }
      callback(err, _.collect(results, function(r){
        return r.value;
      }))
    });
    db.get(uuid, callback);
  }
}

