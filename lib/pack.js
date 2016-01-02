var recursive = require("./util/recursive");
var path = require("path");
var Module = require("module");
var BlockFile = require("./blockfile");
var CssFile = require("./cssfile");
var tags = require("./util/tags");

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

var Pack = function(cfg) {

    var dependencies = [];
    checkDeps(cfg, dependencies);

    var fileList = [];
    var d = path.join(cfg.path ,cfg.tahoe.blocksDir||"blocks");
    recursive(d).forEach(function(f) {
        fileList.push(f);
    });

    this.publicDirs = function() {
        var dirs = [];
        dependencies.forEach(function(d) {
            dirs = dirs.concat(d.publicDirs());
        });
        dirs.push(path.join(cfg.path, cfg.tahoe.publicDir||"public"));
        return dirs.unique();
    };

    this.schema = function(ctx) {
        dependencies.forEach(function(d) {
            d.schema(ctx);
        });
        fileList.forEach(function(f) {
            if (f.indexOf(".xml", f.length - 4) == -1) return;
            var bf = new BlockFile(d, f, ctx);
            bf.compile(tags.schema);
        });
    };

    this.css = function() {
        var css = "";
        dependencies.forEach(function(d) {
            css += d.css();
        });
        fileList.forEach(function(f) {
            if (f.indexOf(".css", f.length - 4) == -1) return;
            var bf = new CssFile(f);
            css += bf.compile(null);
        });
        return css;
    };

    this.js = function() {
        var js = "";
        dependencies.forEach(function(d) {
            js += d.js();
        });
        fileList.forEach(function(f) {
            if (f.indexOf(".js", f.length - 3) == -1) return;
            var jf = new CssFile(f);
            js += jf.compile();
        });
        return js;
    }
};

var checkDeps = function(cfg, dependencies) {
    if (!cfg.tahoe || !cfg.tahoe.dependencies) {
        return;
    }
    var j = module.children.length;
    for (var i = 0; i < cfg.tahoe.dependencies.length; i++) {
        var dep = cfg.tahoe.dependencies[i];
        if (dep.startsWith(".") || dep.startsWith("/")) dep = path.join(cfg.path, dep);
        dep = path.join(dep, "tahoe.json");
        var t = require(dep);
        var p = Module._resolveFilename(dep, module);
        t.path = path.dirname(p);
        dependencies.push(new Pack(t));
    }
};

module.exports = Pack;