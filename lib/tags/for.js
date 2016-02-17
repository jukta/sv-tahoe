var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var For = function() {};
module.exports = For;
util.inherits(For, AbstractTag);

For.prototype.start = function() {
    var v = this.node.attributes['var'];
    var i = this.node.attributes['in'];
    var s = exp.resolveStr(i, "'");
    this.body.write("var _gr = [];");
    this.body.write("for (var " + v + " in " + s + ") {");
    this.body.write("attrs['" + v + "']=" + s+"["+v+"]" + ";");
};

For.prototype.end = function() {
    if (this.child.length > 0) {
        this.body.write("_gr.push(");
        for (var i = 0; i < this.child.length; i++) {
            if (i > 0 ) this.body.write(",");
            this.body.write(this.child[i]);
        }
        this.body.write(")");
    }
    this.body.write("};");
    this.parent.child.push("{_: _gr}");
};