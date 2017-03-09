var through2 = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var fs = require("fs");

module.exports = function(options) {
  var ops = {
    cssName : "bgs.scss"
  };
  options = Object.assign(ops,options);
  var a = "";
  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // add file to concat instance
    var that = this;
    var filepath = file.path;
    // var cwd = file.cwd;
    var imageType = path.extname(filepath);
    var name = path.basename(file.path,imageType);
    fs.readFile(file.path,function(err,data){
      if(err){
        return false;
      }
      var result = 'data:image/' + imageType + ';base64,' + data.toString('base64');
      a += '.bg-'+name+"{\n\tbackground-image:url("+result+") !important;\n}\n";
    })
    cb();
  }

  function endStream(cb) {
    var cssFile = new gutil.File({
      path: options.cssName,
      contents: new Buffer(a)
    });
    this.push(cssFile);
    cb();
  }

  return through2.obj(bufferContents, endStream);
};
