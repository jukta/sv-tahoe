var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Include = function() {};
module.exports = Include;
util.inherits(Include, AbstractTag);

Include.prototype.start = function() {
    this.el = {};
    this.body = new this.Body();
    this.name = this.node.attributes['name'];
    this.isDef = true;

    if (this.node.attributes['file']) {
        this.el.file = this.node.attributes['file'];
    }

    this.name = this.replacePrefix(this.name, this.el.file);
    if (!this.node.isSelfClosing) {

//        var pTag = this.getParentBlock(this.parent);
//        if (!pTag.anCount) pTag.anCount = 0;
//        this.name = "__" + pTag.name+"__"+pTag.anCount++;
//        this.body.write("this.init('" + this.name + "').body(" + attrs + ");");
//        this.body = new this.Body();
    } else {
        this.name = exp.resolveStr(this.name, "'");
        this.body.write("res._render(res.getBlock('" + this.name + "')," + this.attrs + ", res);");
    }
};

Include.prototype.end = function() {
    if (this.node.isSelfClosing) return;
    var p = exp.hasExp(this.name) ? "parent: function(attrs) {return " + exp.resolveStr("${name}", "'") + "}," : "parent: '" + this.name + "',";
    var b = "def: function(_a, res) {" + this.body.s + "}";
    this.parent.body.write("var self = this;");
    this.parent.body.write("res._render(res.init({" + p + b + "})," + this.attrs + ", res);");
};
