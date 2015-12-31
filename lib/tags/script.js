var util = require("util");
var AbstractTag = require("./abstractTag");
var Script = function() {};
module.exports = Script;
util.inherits(Script, AbstractTag);

Script.prototype.start = function() {
    this.body = this.parent.body;
};

Script.prototype.text = function(text) {
    this.body.write(text);
};

