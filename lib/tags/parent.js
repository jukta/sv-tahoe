var util = require("util");
var AbstractTag = require("./abstractTag");
var Parent = function() {};
module.exports = Parent;
util.inherits(Parent, AbstractTag);

Parent.prototype.start = function() {
    var par = this.getParentBlock(this.parent).el.parent;
    var defName = this.getParentDef(this.parent).name;
    if (!defName) defName = "def";
    this.parent.child.push("Ctx.get('" + par + "')['" + defName +"'](attrs, res)");
};