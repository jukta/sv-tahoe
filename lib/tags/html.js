var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var Html = function() {};
module.exports = Html;
util.inherits(Html, AbstractTag);

Html.prototype.start = function() {
    this.body = this.parent.body;
    var attrs = "";
    for (var attr in this.node.attributes) {
        var a = this.node.attributes[attr].trim();
        attrs += " " + attr + "='" + a + "'";
    }
    if (this.node.isSelfClosing) {
        this.body.write("res.write(" + exp.resolveStr("<"+this.node.name+attrs+"/>", "'") + ");");
    } else {
        this.body.write("res.write(" + exp.resolveStr("<"+this.node.name+attrs+">", "'") + ");");
    }
};

Html.prototype.end = function() {
    if (!this.node.isSelfClosing)
        this.body.write('res.write("</'+this.node.name+'>");');
};