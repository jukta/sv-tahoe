var util = require("util");
var AbstractTag = require("./abstractTag");
var Parent = function() {};
module.exports = Parent;
util.inherits(Parent, AbstractTag);

Parent.prototype.start = function() {
    var par = this.getParentBlock(this.parent).el.parent;
    var defName = this.parent.name;
    if (this.parent.deps || !defName) defName = "def";
    this.parent.body.write("res.getBlock('" + par + "')['" + defName +"'](attrs, res);");
};