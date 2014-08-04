define(function(require){

  var ko = require("knockout");
  var $  = require("jquery");
  require("flot");
  require("flot.time")
  require("highcharts");
  var _ = require("underscore");


  ko.bindingHandlers["chart"] = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

      var createChart = function (data) {

        if(data && data.length > 5){
          data = _.map(_.sortBy(data, function(d){
            return parseFloat(d.time);
          }), function (d) {
            return {
              x: (parseFloat(d[0])),
              y: parseFloat(d[1])
            }
          });

          data = _.sortBy(data, function(d){
            return d.x;
          })

          $(element).highcharts({
            chart: {
              zoomType: 'x'
            },
            title: {
              text: 'Garden Temperature over Time'
            },
            xAxis: {
              type: 'datetime',
              max: (_.max(data, function(d){return d.x}).x),
              min: (_.max(data, function(d){return d.x}).x - 24 * 60 *60 * 1000),
              minRange:60 * 1000
            },
            yAxis: {
              title: {
                text: 'Temperature'
              }
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              area: {
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                  stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
                },
                marker: {
                  radius: 2
                },
                lineWidth: 1,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                },
                threshold: null
              }
            },

            series: [
              {
                type: 'area',
                name: 'Temperature (F)',
                data: data
              }
            ]
          });
        }
      };

      valueAccessor().subscribe(createChart)
//      createChart(valueAccessor()());
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called once when the binding is first applied to an element,
      // and again whenever the associated observable changes value.
      // Update the DOM element based on the supplied values here.
    }
  };
})