var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var For = function() {};
module.exports = For;
util.inherits(For, AbstractTag);

For.prototype.start = function() {
    this.body = this.parent.body;
    var v = this.node.attributes['var'];
    var i = this.node.attributes['in'];
    var s = exp.resolveStr(i);
    this.body.write("for (var " + v + " in " + s + ") {");
    this.body.write("attrs['" + v + "']=" + s+"["+v+"]" + ";");};

For.prototype.end = function() {
    this.body.write("};");
};