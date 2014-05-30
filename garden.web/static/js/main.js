
require.config({
  paths: {
    "jquery": "components/jquery/dist/jquery.min",
    "knockout": "components/knockout/dist/knockout",
    "flot": "components/flot/jquery.flot",
    "flot.time": "components/flot/jquery.flot.time",
    "underscore": "components/underscore/underscore",
    "highcharts" : "lib/highcharts"
  }
});

require([
  "jquery",
  "knockout",
  "binding/temperature.binding"
],
function($, ko){

  var serialize = function(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  var uuid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  var rest = {
    "get": function(url, callback){
      $.get(url, function(results){
        callback(results);
      })
    },
    post: function(url, data, callback){
      $.ajax({
        type : 'POST',
        url : url,
        data : serialize(data)
      }).success(callback);
    }
  }

  var app = {
    data : ko.observable(),
    notes : ko.observable(),
    creatingNote: ko.observable(false),
    currentText: ko.observable(""),
    saveNew: function(){
      this.creatingNote(false);
      rest.post("/rest/note", {uuid:uuid(), note:this.currentText(), time: new Date().getTime()}, function(){
        console.log("Done!");
      });
    }
  };


  rest.get("/rest/measurement", function(data){
    app.data(JSON.parse(data));
  })

  rest.get("/rest/note", function(data){
    app.notes(JSON.parse(data));
  })

  ko.applyBindings(app);



})