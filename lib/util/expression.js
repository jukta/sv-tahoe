var elReg = new RegExp("\\${([^}]+)}");
var varReg = new RegExp("\\W*([\\w\\.]+)\\W*");
var digRef = new RegExp("[A-Za-z_]");

var replaceVar = function (s) {
    if (digRef.exec(s[0]) && s != 'true' && s != 'false') return 'attrs.' + s;
    return s;
};

var replaceVars = function(s) {
    var v = s.split(" ");
    for (var i = 0; i < v.length; i++) {
        var v1 = replaceVar(v[i]);
        s = s.replace(v[i], v1);
    }
    return s;
};

var processEl = function(s, q) {
    var out = "";
    var arr = s.split(q);
    for (var i = 0; i < arr.length; i++) {
        if (i % 2 == 0) {
            out += replaceVars(arr[i]);
        } else {
            out += q + arr[i] + q;
        }
    }
    return "(" + out + ")";
};

this.resolveStr = function(s, q) {
    var fl = 0;
    var op = false;

    if (q == '"') {
        s = s.replace(/"/g, "'");
    } else {
        s = s.replace(/'/g, '"');
    }

    while (true) {
        var r = elReg.exec(s);
        if (r == null || r[1] == null) {
            if (q && fl == 0) s = q + s + q;
            else if (op) s += q;
            return s;
        }
        var exp = r[1];
        var rep = processEl(exp, q);
        fl++;
        if (q) {
            if (s.indexOf(r[0]) > 0) {
                rep = q+"+" + rep;
                if (s.indexOf(q) != 0 && fl == 1) s = q+s;
            }
            if (s.lastIndexOf(r[0]) < s.length - r[0].length) {
                rep += "+"+q;
                op = true;
            } else op = false;
        }
        s = s.replace(r[0], rep);
    }
};

this.hasExp = function(str) {
    return elReg.exec(str) != null;
};

module.exports = this;