define(function(require){
  var ko = require("knockout");
  var _  = require("underscore");
  var Log = require("Log");

  function MainPage(measurements){
    var log = new Log("MainPage");

    var self = {
      temperatureData : ko.observable(),
      moistureData : ko.observable()
    }

    measurements.subscribe(function(measurements){
      log.info("Updating the data arrays in the main page");
      self.temperatureData(_.collect(measurements, function(m){
        return [m.time, m.temperature];
      }))
      self.moistureData(_.collect(measurements, function(m){
        return [m.time, m.moisture];
      }))
    })

    return self;
  }


  return MainPage;
})