var fs = require("fs");
var Compiler = require('./lib/compiler');
var path = require("path");

    var handlers = {};

    var registerHandler = function(name, handler) {
        handlers[name] = handler;
    };

    var DataProvider = function (req, res) {
        this.get = function (name) {
            var h = handlers[name];
            if (h) {
                return function(attrs, cb) {
                    attrs.__req = req;
                    attrs.__res = res;
                    h(attrs, cb);
                }
            } else {
                return function(attrs, cb) {
                    cb(null, attrs);
                }
            }
        }
    };

    var c = fs.readFileSync("tahoe.json");
    var cfg = JSON.parse(c);
    cfg.tahoe.destDir = cfg.tahoe.destDir || "dest";
    var compiler = new Compiler(cfg);

    var expressInit = function(app) {
        app.use(function(req, res, next) {
            res.rnd = res.render;
            res.render = function(name, options, callback) {
                options.__req = req;
                options.__res = res;
                res.rnd(name, options, callback);
            };
            next();
        });
        app.use(function(req, res, next) {
            var p = req.url.split("/");
            if (p[1] === '__tahoe') {
                var body = '';
                req.on("data",function(chunk){
                    body += chunk.toString();
                });
                req.on("end",function(){
                    var data = JSON.parse(body);
                    var dp = new DataProvider(req, res);
                    dp.get(p[2])(data, function(err, data) {
                        res.send(JSON.stringify(data));
                    });
                });
            } else {
                next();
            }
        });
        var view = app.get('view');
        view.prototype.lookup = function(path){
            return path.substring(0, path.lastIndexOf('.'));
        };
        app.set('view engine', 'xml');
        app.engine('xml',function(path, options, fn) {
            var i = new DataProvider(options.__req, options.__res);
            module.exports.tmpl.render(path, options, i, fn);
        });
    };

module.exports = {
    config: cfg.tahoe,
    express: expressInit,
    use: registerHandler,
    compile: function(cb) {
        compiler.compile(function(err) {
            if (err) {
                return cb(err);
            }
            var p = path.join(fs.realpathSync("."), cfg.tahoe.destDir, cfg.tahoe.name+"-schema");
            module.exports.tmpl = require(p);
            if (cb) cb();
        });
    }
};
