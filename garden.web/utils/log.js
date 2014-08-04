module.exports = {
  create: function(tag){
    return {
      info: function(message){
        return console.log("[" + tag + "]: " + message);
      },
      error: function(message){
        return console.error("[" + tag + "]: " + message);
      }
    }
  }
}