var Ctx = {
    instances: {},
    anons: {},
    init: function (b) {
        var type = function (type) {
            this.class = type;
        };
        if (b.parent) type.prototype = Object.create(Ctx.get(b.parent).class.prototype);
        for (var f in b)
            if (typeof b[f] === "function") {
                type.prototype[f] = b[f];
            }
        return new type(type);
    },
    get: function (b) {
        return Ctx.instances[b] || (Ctx.instances[b] = Ctx.init(Ctx.schema[b]));
    },
    anon: function (name, b) {
        return Ctx.anon[name] || (Ctx.anon[name] = Ctx.init(b));
    },
    Res: function(provider) {
        this.out = "";
        var self = this;
        this.append = function(s) {this.out += s};
        this._ = function(attrs, v) {
            var v1 = v.split(".");
            for (var i = 0; i < v1.length; i++) {
                attrs = attrs[v1[i]];
                if (!attrs) return "";
            }
            return attrs;
        };
        this.handle = function(attrs, handler, cb) {
            var r = {};
            getHandler(handler)(attrs, function(err, data) {
                r._ = [cb(data, self)];
            });
            return r;
        };
        var getHandler = function(name) {
            var handler = provider ? provider[name] : null;
            return handler ? handler : function(attrs, cb) {cb(null, attrs);}
        }
    },
    it: function (sch, cb) {
        for (var i in sch) if (sch.hasOwnProperty(i)) cb(i, sch[i]);
    },
    j2h: function (name, sch, res) {
        if (sch._name) {
            res.append("<" + sch._name);
            Ctx.it(sch._attrs, function(name, value) {
                res.append(" " + name);
                if (value != "") res.append("=\"" + value + "\"");
            });
            res.append(">\n");
        } else if (!sch._) {
            res.append(sch + "\n");
            return;
        }
        Ctx.it(sch._, function(name, value) {
            Ctx.j2h(name, value, res);
        });
        if (sch._name) res.append("</" + sch._name + ">\n");
    }
};
if (typeof module !== 'undefined') {module.exports = Ctx;}
