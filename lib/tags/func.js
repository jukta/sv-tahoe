var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Func = function() {};
module.exports = Func;
util.inherits(Func, AbstractTag);

Func.prototype.start = function() {
    this.el = {};
    this.defs = {};
    var m = this.node.name.split(":");
    var file = this.ctx.prefixes[m[0]];
    if (file && m[1]) {
        this.name = file + ":" + m[1];
    } else {
        for (var f in this.ctx.prefixes) {
            var tName = this.ctx.prefixes[f] + ":" + m[0];
            if (this.ctx.schema[tName]) {
                this.name = tName;
                break;
            }
        }
    }
    if (!this.name) throw new Error("Could not find block " + this.name);

    this.addDependency(this.name);
    this.isDef = true;
    if (!this.node.isSelfClosing) {
//        this.el.parent = exp.hasExp(this.name) ? evalFunc("return " + exp.resolveStr("${name}", "'")) : this.name;
//        var pTag = getParentBlock(parent);
//        if (!pTag.anCount) pTag.anCount = 0;
//        this.name = "__" + pTag.name+"__"+pTag.anCount++;
//        this.body.write("ctx.callMacro('" + this.name + "', " + attrs + ");");
        this.body = new this.Body();
    } else {
        this.parent.body.write("res._render(res.getBlock('" + this.name + "')," + this.attrs + ", res);");
    }
};

Func.prototype.end = function() {
    if (this.node.isSelfClosing) return;

    for (var d in this.defs) {
        var b = this.defs[d];
        if (b && b.length > 0) this.parent.body.write("this.class.prototype."+d+"=function(_a, res) {" + b + "};");
    }

    var p = exp.hasExp(this.name) ? "parent: function(attrs) {return " + exp.resolveStr("${name}", "'") + "}," : "parent: '" + this.name + "',";
//    var b = "def: function() {" + this.body.s + "},";
    var b = "";

    if (!(this.defs["def"] != null && this.defs["def"].length > 0) && this.body.s.length > 0) b += "def: function(_a, res) {" + this.body.s + "},";

    for (var d in this.defs) {
        b += d+": function(_a, res) {self." + d + "(null, res)},";
    }
    this.parent.body.write("var self = this;");
    this.parent.body.write("res._render(res.init(" + this.ctx.seq++ + ", {" + p + b + "})," + this.attrs + ", res);");


};
