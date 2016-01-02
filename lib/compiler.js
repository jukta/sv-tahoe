var fs = require('fs');
var toSource = require('tosource');
var UglifyJS = require("uglify-js");
var Ctx = require("./util/context");
var path = require("path");
var minimatch = require("minimatch");
var recursive = require("./util/recursive");
var ncp = require('ncp').ncp;
var Pack = require("./pack");

var Compiler = function (cfg) {

    var cfgs = {};
    var dir = fs.realpathSync(".");
    cfg.path = dir;
    if (!cfg) {
        cfg = require(dir + path.sep + "tahoe.json");
    }
    cfgs[dir] = cfg;

    var filterSchema = function(schema, deps) {
        var copy = {};
        for (var blk in schema) {
            if (checkInclude(blk) && checkExclude(blk)) {
                copy[blk] = schema[blk];
                for (var d = 0; d < deps[blk].length; d++) {
                    var n = deps[blk][d];
                    if (!copy[n]) copy[n] = schema[n];
                }
            }
        }
        return copy;
    };

    var checkInclude = function(blk) {
        if (!cfg.tahoe.client.include) return true;
        for (var ind = 0; ind < cfg.tahoe.client.include.length; ind++) {
            if (minimatch(blk, cfg.tahoe.client.include[ind])) {
                return true;
            }
        }
        return false;
    };

    var checkExclude = function(blk) {
        if (!cfg.tahoe.client.exclude) return true;
        for (var ind = 0; ind < cfg.tahoe.client.exclude.length; ind++) {
            if (minimatch(blk, cfg.tahoe.client.exclude[ind])) {
                return false;
            }
        }
        return true;
    };

    this.compile = function(cb) {
        try {
            _compile();
            cb(null);
        } catch(e) {
            cb(e);
        }
    };

    var _compile = function () {
        cfg.tahoe.destDir = cfg.tahoe.destDir||"dest";
        if (!fs.existsSync(cfg.tahoe.destDir)) fs.mkdirSync(cfg.tahoe.destDir);
        var pubDir = path.join(cfg.tahoe.destDir, "public");
        if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir);

        var rootPack = new Pack(cfg);
        var ctx = {};
        rootPack.schema(ctx);

        var cont = fs.readFileSync(__dirname + '/util/context.js');
        var source = toSource(ctx.schema);
        var data = cont + "Ctx.schema = " + source;
        if (cfg.tahoe.minify) data =  UglifyJS.minify(data, {fromString: true}).code;
        fs.writeFileSync(path.join(cfg.tahoe.destDir, cfg.tahoe.name + "-schema.js"), data);

        if (cfg.tahoe.client) {
            source = toSource(filterSchema(ctx.schema, ctx.deps));
            data = cont + "Ctx.schema = " + source;
            if (cfg.tahoe.minify) data = UglifyJS.minify(data, {fromString: true}).code;
            fs.writeFileSync(path.join(pubDir, cfg.tahoe.name + "-schema-client.js"), data);
        }

        var css = rootPack.css();
        if (css && css.length > 0) fs.writeFileSync(path.join(pubDir, cfg.tahoe.name + ".css"), css);

        var js = rootPack.js();
        if (cfg.tahoe.minify) {
            js =  UglifyJS.minify(js, {fromString: true}).code;
        }
        if (js && js.length > 0) fs.writeFileSync(path.join(pubDir, cfg.tahoe.name + "-client.js"), js);


        rootPack.publicDirs().forEach(function(f) {
            ncp(f, pubDir);
        });
    };

    this.getContext = function(cb) {
        schemaCompiler(cfg, function(err, ctx) {
            if (err) return cb(err);
            Ctx.schema = ctx.schema;
            cb(null, Ctx);
        });
    };
};

module.exports = Compiler;



