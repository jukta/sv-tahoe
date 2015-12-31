var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var If = function() {};
module.exports = If;
util.inherits(If, AbstractTag);

If.prototype.start = function() {
    this.body = this.parent.body;
    this.body.write("if (" + exp.resolveStr(this.node.attributes['exp']) + ") {");
};

If.prototype.end = function() {
    this.body.write("};");
};