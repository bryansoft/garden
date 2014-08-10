define(function(require){

  var ko = require("knockout");
  var $  = require("jquery");
  require("flot");
  require("flot.time")
  require("highcharts");
  var _ = require("underscore");


  ko.bindingHandlers["moistureChart"] = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

      var createChart = function (data) {

        if(data && data.length > 5){
          data = _.sortBy(data, function(d){
            return parseFloat(d[0]);
          });

          $(element).highcharts({
            chart: {
              zoomType: 'x'
            },
            title: {
              text: 'Garden Moisture over Time'
            },
            xAxis: {
              type: 'datetime',
//              max: (_.max(data, function(d){return d[0]})[0]),
//              min: (_.max(data, function(d){return d[0]})[0] - 24 * 60 *60 * 1000),
              minRange:60 * 1000
            },
            yAxis: {
              title: {
                text: 'Moisture'
              },
              plotBands: [{
                color: 'orange', // Color value
                from: 800, // Start of the plot band
                to: 1000, // End of the plot band.
                label: {
                  text: 'Dry', // Content of the label.
                  align: 'center' // Positioning of the label.
                }
              },
              {
                color: 'yellow', // Color value
                from: 600, // Start of the plot band
                to: 400, // End of the plot band.
                label: {
                  text: 'Wet', // Content of the label.
                  align: 'center' // Positioning of the label.
                }
              },
              {
                  color: 'red', // Color value
                  from: 400, // Start of the plot band
                  to: 0, // End of the plot band.
                  label: {
                    text: 'Way too wet', // Content of the label.
                    align: 'center' // Positioning of the label.
                  }
              }
              ]
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
                name: 'Moisture Reading (Volts)',
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