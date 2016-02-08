var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var Html = function() {};
module.exports = Html;
util.inherits(Html, AbstractTag);

Html.prototype.start = function() {
    this.body = new this.Body();
    this.body.write("{");
    this.body.write("_name: " + exp.resolveStr(""+this.node.name, "'") + ",");
    if (this.node.attributes) {
        var attrs = "_attrs: {";
        for (var attr in this.node.attributes) {
            var a = this.node.attributes[attr].trim();
            attrs += " " + attr + ":" + exp.resolveStr(""+ a, "'") + ",";
        }
        attrs += "},";
        this.body.write(attrs);
    }
    this.child = [];
};

Html.prototype.end = function() {
    if (!this.node.isSelfClosing) {
        if (this.child.length > 0) {
            this.body.write("_: [");
            for (var i = 0; i < this.child.length; i++) {
                this.body.write(this.child[i] + ",");
            }
            this.body.write("]");
        }
    }
    this.body.write("}");
    this.parent.child.push(this.body.s);
};