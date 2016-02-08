var util = require("util");
var AbstractTag = require("./abstractTag");

var Def = function() {};
module.exports = Def;
util.inherits(Def, AbstractTag);

Def.prototype.start = function() {
    this.body = new this.Body();
    this.name = "def";
    if (this.node.attributes.name) {
        this.name += "_" + this.node.attributes.name;
    }
    if (this.getParentBlock(this.parent).isDef) {
        this.parent.child.push("self." + this.name + "(attrs, res)")
    } else {
        this.parent.child.push("this." + this.name + "(attrs, res)")
    }
    this.child = [];

};

Def.prototype.end = function() {
    this.body.write("return {");
    if (this.child.length > 0) {
        this.body.write("_: [");
        for (var i = 0; i < this.child.length; i++) {
            this.body.write(this.child[i] + ",");
        }
        this.body.write("]");
    }
    this.body.write("}");

    var parent = this.getParentBlock(this.parent);
    if (!parent) throw new Error("Could not find parent block");
    if (!parent.defs) parent.defs = {};
    parent.defs[this.name] = this.body.s;
};
