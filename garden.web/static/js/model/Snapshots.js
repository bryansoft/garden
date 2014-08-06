define(function(require){
  var ko = require("knockout");
  var _ = require("underscore");

  function Snapshots(rest){

    var self = ko.observable([]);

    rest.get("/rest/snapshot", {
      success: function(snapshots){
        self(snapshots);
      }
    })
    return self;
  }
  return Snapshots;
})