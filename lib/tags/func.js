var util = require("util");
var AbstractTag = require("./abstractTag");
var exp = require("../util/expression");
var Func = function() {};
module.exports = Func;
util.inherits(Func, AbstractTag);

Func.prototype.start = function() {
    this.el = {};
    this.defs = {};
    var m = this.node.name.split(":");
    var file = this.ctx.prefixes[m[0]];
    if (file && m[1]) {
        this.name = file + ":" + m[1];
    } else {
        for (var f in this.ctx.prefixes) {
            var tName = this.ctx.prefixes[f] + ":" + m[0];
            if (this.ctx.schema[tName]) {
                this.name = tName;
                break;
            }
        }
    }
    if (!this.name) throw new Error("Could not find block " + this.name);

    this.addDependency(this.name);
    this.isAnon = true;
    this.body = new this.Body();
};

Func.prototype.end = function() {
    var _body = new this.Body();
    _body.write("Ctx.anon(" + this.ctx.seq++ +", {parent: '" + this.name + "'");

    var c = 0;
    var block = this.getRootBlock(this);
    for (var d in this.defs) {
        c++;
        if (block.defs[d]) {
//            throw new Error("Duplicate def name");
            _body.write(", " + d + ": function(_a, res) {" + this.defs[d] + "}");
        } else {
            _body.write(", " + d + ": function(_a, res) {return self." + d + "(attrs, res)}");
            block.defs[d] = this.defs[d];
        }
    }

    if (this.child && this.child.length > 0) {
        _body.write(", def: function(_a, res) { return {");
        _body.write(this.body.s);
        this.printChildren(_body);
        _body.write("}}");
    }

    _body.write("}).body(" + this.attrs + ", res)");
    this.parent.child.push(_body.s);
};
