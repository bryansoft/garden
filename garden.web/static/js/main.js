
require.config({
  paths: {
    "jquery": "components/jquery/dist/jquery.min",
    "knockout": "components/knockout/dist/knockout",
    "flot": "components/flot/jquery.flot",
    "flot.time": "components/flot/jquery.flot.time",
    "underscore": "components/underscore/underscore",
    "fullcalendar": "components/fullcalendar/dist/fullcalendar",
    "moment": "components/moment/moment",
    "highcharts" : "lib/highcharts",
    "Log" : "utils/Log"
  },
  shim:{
    "jquery":{exports:["$", "jQuery"]},
    "flot.time": {deps:["jquery"]},
    "flot": {deps:["jquery"]},
    "highcharts": {deps:["jquery"]},
    "fullcalendar": {
      deps:["jquery", "moment"]
    }
  }
});
require([
  "knockout",
  "utils/Rest",
  "model/Measurements",
  "viewmodel/MainPage",
  "views/moisture",
  "views/chart"
], function(
  ko,
  Rest,
  Measurements,
  MainPage,
  Chart
  ){
  var rest = new Rest();
  var measurements = new Measurements(rest);

  var mainPage = new MainPage(measurements)
  ko.applyBindings(mainPage);
})
//require([
//  "jquery",
//  "knockout",
//  "underscore",
//  "binding/temperature.binding",
//  "fullcalendar"
//],
//function($, ko, _){

//  ko.bindingHandlers.calendar = {
//    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
//      valueAccessor().subscribe(function(data){
//        $(element).fullCalendar({
//          header: {
//            left: 'prev,next today',
//            center: 'title'
//          },
//          editable: true,
//          events: _.map(data, function(d){
//            return {
//              title: d.note,
//              start: d.time * 1000
//            }
//          })
//        });
//      })
//    },
//    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
//    }
//  };
//
//  var serialize = function(obj) {
//    var str = [];
//    for(var p in obj)
//      if (obj.hasOwnProperty(p)) {
//        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//      }
//    return str.join("&");
//  }
//
//  var uuid = function(){
//    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//      return v.toString(16);
//    });
//  }
//
//  var rest = {
//    "get": function(url, callback){
//      $.get(url, function(results){
//        callback(results);
//      })
//    },
//    post: function(url, data, callback){
//      $.ajax({
//        type : 'POST',
//        url : url,
//        data : serialize(data)
//      }).success(callback);
//    }
//  }
//
//  var app = {
//    data : ko.observable(),
//    notes : ko.observable(),
//    creatingNote: ko.observable(false),
//    currentText: ko.observable(""),
//    saveNew: function(){
//      this.creatingNote(false);
//      rest.post("/rest/note", {uuid:uuid(), note:this.currentText(), time: new Date().getTime()}, function(){
//        console.log("Done!");
//      });
//    }
//  };
//
//
//  rest.get("/rest/measurement", function(data){
//    app.data(JSON.parse(data));
//  })
//
//  rest.get("/rest/note", function(data){
//    app.notes(JSON.parse(data));
//  })
//
//  ko.applyBindings(app);



//})