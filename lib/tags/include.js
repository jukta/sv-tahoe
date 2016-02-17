var util = require("util");
var Func = require("./func");
var exp = require("../util/expression");
var Include = function() {};
module.exports = Include;
util.inherits(Include, Func);

Include.prototype.start = function() {
    this.el = {};
    this.defs = {};

    this.name = this.node.attributes['name'];

    if (this.node.attributes['file']) {
        this.el.file = this.node.attributes['file'];
    }

    if (!this.name) throw new Error("Could not find block " + this.name);

    this.name = this.replacePrefix(this.name, this.el.file);
    this.isAnon = true;
    this.body = new this.Body();
};
