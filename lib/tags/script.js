var util = require("util");
var AbstractTag = require("./abstractTag");
var Script = function() {};
module.exports = Script;
util.inherits(Script, AbstractTag);

Script.prototype.text = function(text) {
    this.body.write(text);
};