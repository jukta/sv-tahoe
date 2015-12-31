var util = require("util");
var AbstractTag = require("./abstractTag");
var Root = function() {};
module.exports = Root;
util.inherits(Root, AbstractTag);

Root.prototype.start = function() {
    var p = this.node.attributes["pref"];
    this.ctx.prefixes[p] = this.ctx.name;
};