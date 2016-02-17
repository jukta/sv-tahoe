var util = require("util");
var AbstractTag = require("./abstractTag");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    var name = this.node.attributes['name'];
    var value = this.node.attributes['value'];
    this.parent.attrs[name] = value;
};