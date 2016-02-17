var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    this.name = this.node.attributes['name'];
//    this.body.write("res.write('<"+ this.name +"');");
    this.attrs = {};
};

Block.prototype.end = function() {
    var _body = new this.Body();
    _body.write("{");
    _body.write("_name: " + exp.resolveStr(""+this.name, "'") + ",");
    if (this.attrs) {
        var attrs = "_attrs: {";
        var i = 0;
        for (var attr in this.attrs) {
            var a = this.attrs[attr];
            a = a ? a.trim() : "";
            if (i++ > 0) attrs += ", ";
            attrs += " " + attr + ":" + exp.resolveStr(""+ a, "'");
        }
        attrs += "},";
        if (i > 0)_body.write(attrs);
    }

    this.printChildren(_body);
    _body.write("}");
    this.parent.child.push(_body.s);
};