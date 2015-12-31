var util = require("util");
var AbstractTag = require("../abstractTag");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    var n = this.node.attributes['name'];
    if (!n) throw new Error("Name attribute for block is required");
    this.name = this.ctx.name + ":" + n;
    this.el = {};
    this.el.name = n;
    this.el.package = this.ctx.name;
    var par = this.node.attributes['parent'];
    if (par) {
        this.el.parent = this.replacePrefix(par);
    }
    if (!this.ctx.schema.toc) {
        this.ctx.schema.toc = {};
    }
    if (!this.ctx.schema.blocks) {
        this.ctx.schema.blocks = {};
    }

    if (!this.ctx.schema.toc[this.ctx.lib]) {
        this.ctx.schema.toc[this.ctx.lib] = {
            libName: this.ctx.lib,
            packages:{}
        };
    }
    if (!this.ctx.schema.toc[this.ctx.lib].packages[this.el.package]) {
        this.ctx.schema.toc[this.ctx.lib].packages[this.el.package] = {
            packageName: this.el.package,
            blocks : {}
        }
    }
    this.ctx.schema.toc[this.ctx.lib].packages[this.el.package].blocks[this.name] = this.el.name;
    this.ctx.schema.blocks[this.name] = this.el;
};

Block.prototype.text = function(text) {

};

Block.prototype.end = function() {

};