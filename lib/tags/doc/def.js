var util = require("util");
var AbstractTag = require("../abstractTag");
var Def = function() {};
module.exports = Def;
util.inherits(Def, AbstractTag);

Def.prototype.start = function() {
    var n = this.node.attributes['name'];
    if (!n) n = "-";
    this.def = {
        name: n,
        text: ""
    };
};

Def.prototype.text = function(text) {
    this.def.text = this.def.text + text;
};

Def.prototype.end = function() {
    var p = this.getParentBlock(this.parent);
    if (!p.el.defs) {
        p.el.defs = [];
    }
    p.el.defs.push(this.def);
};