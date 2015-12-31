var fs = require("fs");
var sax = require("sax");
var strict = true; // set to false for html-mode
var extend = require('util')._extend;
var path = require("path");

var BlockFile = function(dir, file, ctx) {
    this.seq = 0;
    this.schema = {};
    this.prefixes = {};
    this.fileName = "";
    var self = this;
    this.deps = [];
    this.files = {};

    this.compile = function(tags) {
        this.tags = tags;
        if (!ctx.schema) ctx.schema = {};
        if (!ctx.files) ctx.files = {};
        if (!ctx.deps) ctx.deps = {};
        this.files = ctx.files;
        this.schema = ctx.schema;
        this.parseFile(dir, file);
        extend(ctx.schema, this.schema);
        extend(ctx.files, this.files);
        extend(ctx.deps, this.deps);
    };

    this.findAndParse = function(pack) {
        if (typeof self.files[pack] != "undefined") return;
        var p = path.join(dir, pack);
        var p1 = path.join(p, pack.lastIndexOf("/") != -1 ? pack.substr(pack.lastIndexOf("/")) : pack);
        var fb;
        if (fs.existsSync(p+".xml")) {
            fb = new BlockFile(dir, p+".xml", this);
        } else if (fs.existsSync(p1+".xml")) {
            fb = new BlockFile(dir, p1+".xml", this);
        } else {
            throw new Error("Could not find " + pack);
        }
        fb.compile(this.tags);
    };

    this.parseFile = function(dir, file) {
        var xml = fs.readFileSync(file, "UTF-8");
        var fileName = path.relative(dir, file);

        fileName = fileName.replace(/\\/g, "/");
        var res = path.parse(fileName);
        var name = res.dir;
        if (name == "") {
            name = res.name;
        } else if ((name.length < res.name.length) || name.lastIndexOf(res.name) != (name.length - res.name.length)) {
            name += "/"+res.name;
        }
        if (self.files[name] != undefined) return;

        self.prefixes = {};
        self.fileName = fileName;
        self.name = name;
        self.files[self.name] = self.fileName;

        try {
            var p = getParser(this, this.tags);
            p.write(xml);
            p.close();
        } catch (e) {
            throw new Error("File \"" + self.fileName + "\" - " + e.message);
        }
    };
};


module.exports = BlockFile;

var getParser = function(ctx, tags) {
    var stack = [];
    var parser = sax.parser(strict);
    parser.onerror = function (e) {};

    parser.ontext = function (t) {
        var inst = stack[stack.length-1];
        t = t.trim();
        if (t.length > 0 && inst['text'] && typeof inst['text'] === 'function' ) inst.text(t);
    };

    parser.onopentag = function (node) {
        var inst = tags.getTag(ctx, node, stack[stack.length-1]);
        stack.push(inst);
        inst.start();
    };

    parser.onclosetag = function (name) {
        var inst = stack.pop();
        if (inst && inst['end'] && typeof inst['end'] === 'function' ) inst.end();
        if (inst.deps && inst.deps.length > 0) {
            ctx.deps[inst.name] = inst.deps;
        }
    };

    parser.onattribute = function (attr) {};

    parser.onend = function () {};
    return parser;
};