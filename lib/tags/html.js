var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var Html = function() {};
module.exports = Html;
util.inherits(Html, AbstractTag);

Html.prototype.start = function() {
    this._body = new this.Body();
    this._body.write("{");
    this._body.write("_name: " + exp.resolveStr(""+this.node.name, "'") + ",");
    if (this.node.attributes) {
        var attrs = "_attrs: {";
        var i = 0;
        for (var attr in this.node.attributes) {
            var a = this.node.attributes[attr].trim();
            if (i++ > 0) attrs += ", ";
            attrs += " " + attr + ":" + exp.resolveStr(""+ a, "'");
        }
        attrs += "},";
        if (i > 0) this._body.write(attrs);
    }
};

Html.prototype.end = function() {
    this.printChildren(this._body);
    this._body.write("}");
    this.parent.child.push(this._body.s);
};