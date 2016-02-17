var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var If = function() {};
module.exports = If;
util.inherits(If, AbstractTag);

If.prototype.start = function() {
    this.body.write("var _gr = [];");
    this.body.write("if (" + exp.resolveStr(this.node.attributes['exp']) + ") {");
};

If.prototype.end = function() {

    if (this.child.length > 0) {
        this.body.write("_gr = [");
        for (var i = 0; i < this.child.length; i++) {
            if (i > 0 ) this.body.write(",");
            this.body.write(this.child[i]);
        }
        this.body.write("]");
    }
    this.body.write("};");
    this.parent.child.push("{_: _gr}");
};