var util = require("util");
var AbstractTag = require("./abstractTag");
var Import = function() {};
module.exports = Import;
util.inherits(Import, AbstractTag);

Import.prototype.start = function() {
    var file = this.node.attributes['file'];
    file = file.replace(/\\/g, "/");
    var prefix = this.node.attributes['prefix'];
    if (!prefix || prefix == "") {
        prefix = file;
    }

    this.ctx.prefixes[prefix] = file;
    this.ctx.findAndParse(file);
};

