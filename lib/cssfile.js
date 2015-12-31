var fs = require("fs");
var varRegex = new RegExp("\\${[^}]+}");

var CssFile = function(file) {

    var resolveEl = function(s, data) {
        if (!data) return s;
        var r;
        while ((r = varRegex.exec(s)) != null) {
            for (var i = 0; i < r.length; i++) {
                var exp = r[i];
                if (exp.substring(0, 2) === "${" && exp.substring(exp.length-1, exp.length) === "}") {
                    var rep = eval("data." + exp.substring(2, exp.length - 1) + "");
                    s = s.replace(exp, rep);
                }
            }
        }
        return s;
    };

    this.compile = function(data) {
        var css = fs.readFileSync(file, "UTF-8");
        css = "/* sv:" + file + " */\n" + css;
        return resolveEl(css, data);
    }

};

module.exports = CssFile;