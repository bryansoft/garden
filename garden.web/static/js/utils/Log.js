define(function(require){

  return function(tag){
    return {
      info:function(message){
        console.log("[" + tag + "]: " + message);
      },
      warn:function(message){
        console.warn("[" + tag + "]: " + message);
      },
      error:function(message){
        console.error("[" + tag + "]: " + message);
      }
    }
  }

})