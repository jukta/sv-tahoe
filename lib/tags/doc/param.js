var util = require("util");
var AbstractTag = require("../abstractTag");
var Param = function() {};
module.exports = Param;
util.inherits(Param, AbstractTag);

Param.prototype.start = function() {
    var n = this.node.attributes['name'];
    if (!n) throw new Error("Name attribute for parameter is required");
    this.param = {
        name: n,
        text: ""
    };
};

Param.prototype.text = function(text) {
    this.param.text = this.param.text + text;
};

Param.prototype.end = function() {
    var p = this.getParentBlock(this.parent);
    if (!p.el.params) {
        p.el.params = [];
    }
    p.el.params.push(this.param);
};