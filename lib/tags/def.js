var util = require("util");
var AbstractTag = require("./abstractTag");

var Def = function() {};
module.exports = Def;
util.inherits(Def, AbstractTag);

Def.prototype.isOverride = function(block) {
    if (!block) return false;
    var bl = this.ctx.schema[block];
    return !! bl[this.name] || this.isOverride(bl.parent);
};

Def.prototype.start = function() {
    this.body = new this.Body();
    this.name = "def";
    this.isDef = true;
    if (this.node.attributes.name) {
        this.name += "_" + this.node.attributes.name;
    }
    this.seq = this.ctx.seq++;

    var pBlock = this.getParentBlock(this.parent);
    var pBlockName = pBlock.isAnon ? pBlock.name : pBlock.el.parent;
    this.isOverride(pBlockName);

    if (!this.isOverride(pBlockName)) {
        this.parent.child.push("self." + this.name + "(attrs, res)")
    }
    this.child = [];

};

Def.prototype.end = function() {
    this.body.write("var self = this;");
    this.body.write("return {");
    this.printChildren();
    this.body.write("}");

    var parent = this.getParentBlock(this.parent);
    if (!parent) throw new Error("Could not find parent block");
    if (!parent.defs) parent.defs = {};
    parent.defs[this.name] = this.body.s;
};
