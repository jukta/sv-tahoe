var util = require("util");
var AbstractTag = require("./abstractTag");
var Block = function() {};
module.exports = Block;
util.inherits(Block, AbstractTag);

Block.prototype.start = function() {
    this.body = new this.Body();
    if (!this.node.attributes['name']) throw new Error("Name attribute for block is required");
    this.name = this.ctx.name + ":" + this.node.attributes['name'];
    this.par = this.node.attributes['parent'];
    this.deps = [];
    this.el = {};
    this.defs = {};
    if (this.par) {
        this.el.parent = this.replacePrefix(this.par);
    }
    var handler = this.node.attributes["data-handler"];
    if (handler) {
        this.el.handler = handler;
    }
};

Block.prototype.end = function() {
    var c = 0;
    if (this.defs) {
        for (var d in this.defs) {
            c++;
            this.el[d] = this.evalFunc(this.defs[d]);
        }
    }


    if (!this.par) {

        this.body.write("var self = this;");
        if (this.el.handler) this.body.write("return res.handle(attrs, '" + this.el.handler + "', function(attrs, res) {");
        this.body.write("return {");
        this.printChildren();
        this.body.write("}");
        if (this.el.handler) this.body.write("});");
        this.el.body = this.evalFunc(this.body.s);

    } else if (c==0 && this.child.length > 0) {
        this.body.write("var self = this;");
        this.body.write("return {");
        this.printChildren();
        this.body.write("}");
        this.el.def = this.evalFunc(this.body.s);
    }
    if (this.par && this.el.handler) {
        var _body = new this.Body();
        _body.write("var self = this;");
        _body.write("return res.handle(attrs, '" + this.el.handler + "', function(attrs, res) {");
        _body.write("return Ctx.get('" + this.el.parent + "').class.prototype.body.call(self, attrs, res)");
        _body.write("});");
        this.el.body = this.evalFunc(_body.s);
    }
    this.ctx.schema[this.name] = this.el;

};