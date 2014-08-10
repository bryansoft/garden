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

    measurements.getMoistureByHour(function(moisiture){
      self.moistureData(moisiture);
    })
    measurements.getTemperatureByHour(function(moisiture){
      self.temperatureData(moisiture);
    })
    measurements.subscribe(function(measurements){
      log.info("Updating the data arrays in the main page");
      self.temperatureData(_.collect(measurements, function(m){
        return [parseFloat(m.time), parseFloat(m.temperature)];
      }))
//      self.moistureData(_.collect(measurements, function(m){
//        return [parseFloat(m.time), parseFloat(m.moisture)];
//      }))
    })

    return self;
  }


  return MainPage;
})