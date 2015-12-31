var util = require("util");
var AbstractTag = require("../abstractTag");
var Doc = function() {};
module.exports = Doc;
util.inherits(Doc, AbstractTag);

Doc.prototype.start = function() {
    this.doc = "";
};

Doc.prototype.text = function(text) {
    this.doc = this.doc + text;
};

Doc.prototype.end = function() {
    var p = this.getParentBlock(this.parent);
    p.el.doc = this.doc;
};