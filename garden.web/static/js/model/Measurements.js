define(function(require){
  var ko = require("knockout");
  var _ = require("knockout");

  function Measurements(rest){

    var self = ko.observable([]);


    rest.get("/rest/measurement/latest", {
      success: function(measurements){
        self(measurements);
      }
    })

    self.loadMore = function(){
      var min  = _.min(self(), function(m){
        return m.time;
      });
      if(min){
        rest.get("/rest/measurement/latest/" + min.time);
      }
    }
    return self;
  }
  return Measurements;
})