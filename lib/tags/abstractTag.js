var vm = require("vm");
var exp = require("../util/expression");
var AbstractTag = function() {};

AbstractTag.prototype.init = function(ctx, node, parent) {
    this.ctx = ctx;
    this.node = node;
    this.parent = parent;
    this.attrs = "{";
    for (var attr in this.node.attributes) {
        if (attr == "name" || attr == "parent") continue;
        var a = this.node.attributes[attr].trim();
        this.attrs += attr + ":" + exp.resolveStr(a, "'") + ",";
    }
    this.attrs += "}";
};

AbstractTag.prototype.start = function() {};

AbstractTag.prototype.text = function(text) {
    text = text.replace(/[\n\r]+/g, "<br/>");
    this.child.push(''+exp.resolveStr(text, "'"));
};

AbstractTag.prototype.end = function() {};

AbstractTag.prototype.Body = function() {
    this.s = "";
    this.write = function(str) {
        this.s += str;
    }
};

var sandbox = {};
var context = new vm.createContext(sandbox);

AbstractTag.prototype.evalFunc = function(str) {
    try {
        var script = new vm.Script("var a = function(attrs, res) {" + str + "}");
        script.runInContext(context);
    } catch (e) {
        console.error("Error in " + str);
    }
    return sandbox.a;
};

AbstractTag.prototype.replacePrefix = function (name, pref) {
    if (pref) {
        return pref + ":" + name;
    }
    var n = name;
    for (var p in this.ctx.prefixes) {
        var ph = p + ":";
        if (n.indexOf(ph) != -1) {
            n = n.replace(ph, this.ctx.prefixes[p] + ":");
            break;
        }
    }

    if (n == name) {
        n = this.ctx.name + ":" + name;
    }
    return n;
};

AbstractTag.prototype.getParentBlock = function(tag) {
    if (!tag) return;
    if (tag.el) return tag;
    else return this.getParentBlock(tag.parent);
};

AbstractTag.prototype.addDependency = function(tag) {
    if (this.deps) {
        this.deps.push(tag);
    } else if (this.parent) {
        this.parent.addDependency(tag);
    }
};

module.exports = AbstractTag;
