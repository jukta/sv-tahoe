var util = require("util");
var AbstractTag = require("./abstractTag");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    this.name = this.ctx.name + ":" + this.node.attributes['name'];
    this.par = this.node.attributes['parent'];
    this.deps = [];
    this.el = {};
    this.defs = {};
    this.body = new this.Body();
    if (this.par) {
        this.el.parent = this.replacePrefix(this.par);
    }
    var handler = this.node.attributes["data-handler"];
    if (handler) {
        this.el.handler = handler;
    }
//    this.body.write("var self = this;");
};

Block.prototype.end = function() {
    var c = 0;
    if (this.defs) {
        for (var d in this.defs) {
            c++;
            this.el[d] = this.evalFunc(this.defs[d]);
        }
    }

    if (!this.par) {
        this.el.body = this.evalFunc(this.body.s);
    } else if (c==0 && this.body.s.length > 0) {
        this.el.def = this.evalFunc(this.body.s);
    }
    this.ctx.schema[this.name] = this.el;

};