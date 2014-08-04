define(function(require){
  var $ = require("jquery");
  var Log = require("Log");

  function Rest(){
    var log = new Log("Rest");

    var self = {
      get: function(url, callbacks){
        log.info("Executing rest request: " + url);
        $.ajax("." + url, {
          success:callbacks.success,
          error: function(err){
            log.error("Failed rest request: " + JSON.stringify(err));
            if(callbacks.error){
              callbacks.error(err);
            }
          }
        })
      }
    }
    return self;
  }

  return Rest;


})