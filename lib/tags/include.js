var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Include = function() {};
module.exports = Include;
util.inherits(Include, AbstractTag);

Include.prototype.start = function() {
    this.el = {};
    this.defs = {};

    this.name = this.node.attributes['name'];

    if (this.node.attributes['file']) {
        this.el.file = this.node.attributes['file'];
    }

    if (!this.name) throw new Error("Could not find block " + this.name);

    this.name = this.replacePrefix(this.name, this.el.file);
//    this.name = exp.resolveStr(this.name, "'");

    this.isDef = true;
    if (!this.node.isSelfClosing) {
        this.body = new this.Body();
    } else {
        this.parent.body.write("res._render(res.getBlock('" + this.name + "')," + this.attrs + ", res);");
    }
};

Include.prototype.end = function() {
    if (this.node.isSelfClosing) return;

    for (var d in this.defs) {
        var b = this.defs[d];
        if (b && b.length > 0) this.parent.body.write("this.class.prototype."+d+"=function(_a, res) {" + b + "};");
    }

    var p = exp.hasExp(this.name) ? "parent: function() {return " + exp.resolveStr(this.name, "'") + "}," : "parent: '" + this.name + "',";
//    var b = "def: function() {" + this.body.s + "},";
    var b = "";

    if (!(this.defs["def"] != null && this.defs["def"].length > 0) && this.body.s.length > 0) b += "def: function(_a, res) {" + this.body.s + "},";

    for (var d in this.defs) {
        b += d+": function(_a, res) {self." + d + "(null, res)},";
    }
    this.parent.body.write("var self = this;");
    this.parent.body.write("res._render(res.init(" + this.ctx.seq++ + ", {" + p + b + "})," + this.attrs + ", res);");


};
