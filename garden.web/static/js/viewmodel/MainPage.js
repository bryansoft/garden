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

    return self;
  }


  return MainPage;
})