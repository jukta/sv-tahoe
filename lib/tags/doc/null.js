var util = require("util");
var AbstractTag = require("../abstractTag");
var Null = function() {};
module.exports = Null;
util.inherits(Null, AbstractTag);

Null.prototype.start = function() {
};

Null.prototype.text = function(text) {

};

Null.prototype.end = function() {

};