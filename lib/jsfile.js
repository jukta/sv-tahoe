var fs = require("fs");

var JsFile = function(file) {

    this.compile = function() {
        var js = fs.readFileSync(file, "UTF-8");
        return js;
    }
};

module.exports = JsFile;