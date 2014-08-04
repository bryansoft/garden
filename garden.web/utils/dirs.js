var fs = require("fs");
var log = require("../utils/log").create("DIRS")
var path = require("path");

var dirs = module.exports = {
  home:   path.resolve(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], ".garden"),
  images: path.resolve(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], ".garden", "images")
}
fs.exists(dirs.home, function(exists){
  if(!exists){
    log.info("base directory didn't exist. Creating..")
    fs.mkdir(dirs.home, function(){

    });
  }

  fs.exists(dirs.images, function(exists){
    if(!exists){
      log.info("images directory didn't exist. Creating..")
      fs.mkdir(dirs.images, function(err){
        if(err){
          log.error("Failed creating images dir: " + err)
        }
      });
    }
  })
})
