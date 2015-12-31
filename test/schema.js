var Compiler = require("../lib/compiler.js");

var cw = {};

module.exports = {
    setUp: function(callback) {
        if (cw.ctx) {
            this.ctx = cw.ctx;
            return callback();
        }

        var cfg = {
            "tahoe": {
                "name": "test",
                "blocksDir": "test/blocks"
            }
        };

        var compiler = new Compiler(cfg);
        var self = this;
        compiler.compile(function(err) {
            if (err) return console.error(err);
            var ctx = require("../dest/test-schema");
            cw.ctx = ctx;
            self.ctx = ctx;
            callback();
        });
    },
    "var": function(test) {
        this.ctx.render("var:var", {x:"value"}, null, function(err, s) {
            test.equal(s, "value");
            test.done();
        });

    },
    "var/for": function(test) {
        this.ctx.render("var/for:C", {}, null, function(err, s) {
            test.equal(s, "123");
            test.done();
        });
    },
    "parent_test": function(test) {
        this.ctx.render("var:parent_test", {x:"value"}, null, function(err, s) {
            test.equal(s, "value");
            test.done();
        });
    },
    "anon_def_test": function(test) {
        this.ctx.render("var:anon_def_test", {x:"value"}, null, function(err, s) {
            test.equal(s, "value");
            test.done();
        });
    },
    "call_parent": function(test) {
        this.ctx.render("var:call_parent", {}, null, function(err, s) {
            test.equal(s, "parent");
            test.done();
        });

    },
    "context": function(test) {
        this.ctx.render("var:context", {x:"hello"}, null, function(err, s) {
            var ex = "0-open hello1-open undefined2-open helloin hello2-close hello1-close undefined0-close hello";
            test.equal(s, ex);
            test.done();
        });
    },
    "anon": function(test) {
        this.ctx.render("anon:B", {x:"hello"}, null, function(err, s) {
            var ex = "hello";
            test.equal(s, ex);
            test.done();
        });
    },
    "anon/cascade": function(test) {
        this.ctx.render("anon/cascade:D", {x:"hello"}, null, function(err, s) {
            var ex = "dcbahelloabcd";
            test.equal(s, ex);
            test.done();
        });
    },
    "anon/cascade-named": function(test) {
        this.ctx.render("anon/cascade-named:D", {x:"hello"}, null, function(err, s) {
            var ex = "dcbahelloabcd";
            test.equal(s, ex);
            test.done();
        });
    },
    "anon/new-def": function(test) {
        this.ctx.render("anon/new-def:D", {x:"hello"}, null, function(err, s) {
            var ex = "abdba";
            test.equal(s, ex);
            test.done();
        });
    },
    "inheritance/simple": function(test) {
        this.ctx.render("inheritance/simple:B", {}, null, function(err, s) {
            var ex = "hello";
            test.equal(s, ex);
            test.done();
        });
    },
    "inheritance/multi": function(test) {
        this.ctx.render("inheritance/multi:C", {}, null, function(err, s) {
            var ex = "hello from C";
            test.equal(s, ex);
            test.done();
        });
    },
    "inheritance/named-defs": function(test) {
        this.ctx.render("inheritance/named-defs:C", {}, null, function(err, s) {
            var ex = "a in Cb in C";
            test.equal(s, ex);
            test.done();
        });
    },
    "inheritance/cascade": function(test) {
        this.ctx.render("inheritance/cascade:C", {}, null, function(err, s) {
            var ex = "a1b1b in Cb2a2";
            test.equal(s, ex);
            test.done();
        });
    },
    "inheritance/default-defs": function(test) {
        this.ctx.render("inheritance/default-defs:C", {}, null, function(err, s) {
            var ex = "a definition";
            test.equal(s, ex);
            test.done();
        });
    },
    "handler/simple": function(test) {
        var provider = {
            a: function(attrs, cb) {
                cb(null, {x:attrs.y + "1"});
            },
            get: function(name) {
                return provider[name];
            }
        };
        this.ctx.render("handler/simple:A", {y:"hello"}, provider, function(err, s) {
            var ex = "hello1";
            test.equal(s, ex);
            test.done();
        });
    },
    "handler/cascade": function(test) {
        var provider = {
            a: function(attrs, cb) {
                cb(null, {x:attrs.y1 + "11"});
            },
            b: function(attrs, cb) {
                cb(null, {z:attrs.y + "1"});
            },
            get: function(name) {
                return provider[name];
            }
        };
        this.ctx.render("handler/cascade:B", {y:"hello"}, provider, function(err, s) {
            var ex = "hello1f11";
//            console.log(s);
            test.equal(s, ex);
            test.done();
        });
    }
};