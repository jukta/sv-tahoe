var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    var name = this.node.attributes['name'];
    var value = this.node.attributes['value'];
    this.body = this.parent.body;
    this.body.write("res.write(' "+ name +"');");
    if (value) {
        value = "='" + value + "'";

        this.body.write('res.write('+exp.resolveStr(value, "'")+');');

//        this.body.write("res.write('"+ value +"');");
    }
};