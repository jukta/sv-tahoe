var util = require("util");
var AbstractTag = require("./abstractTag");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    this.name = this.node.attributes['name'];
    this.body = this.parent.body;
    this.body.write("res.write('</"+ this.name +">');");
};