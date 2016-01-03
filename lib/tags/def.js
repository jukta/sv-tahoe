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
        this.parent.body.write("self." + this.name + "(attrs, res);")
    } else {
        this.parent.body.write("this." + this.name + "(attrs, res);")
    }

};

Def.prototype.end = function() {
//    if (this.body.s != null && this.body.s.length > 0)
    var parent = this.getParentBlock(this.parent);
    if (!parent) throw new Error("Could not find parent block");
    if (!parent.defs) parent.defs = {};
        parent.defs[this.name] = this.body.s;
//        this.getParentBlock(this.parent).el[this.name] = this.evalFunc(this.body.s);
};
