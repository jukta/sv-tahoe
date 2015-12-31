var util = require("util");
var exp = require("../util/expression");
var AbstractTag = require("./abstractTag");
var Set = function() {};
module.exports = Set;
util.inherits(Set, AbstractTag);

Set.prototype.start = function() {
    var override = this.node.attributes["override"];
    var name = this.node.attributes["name"];

    name || (name = "");


    var value = this.node.attributes["value"];
    var s = "attrs."+name+"="+exp.resolveStr(value, "'");
    if (override == 'false') s = "attrs."+name+" || (" + s +")";
    this.parent.body.write(s+";");
};

