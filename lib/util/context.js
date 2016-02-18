var Ctx = {
    types: {},
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
        return type;
    },
    get: function (b) {
        var type = Ctx.init(Ctx.schema[b]);
        return new type(type);
    },
    anon: function (name, b) {
        var type = Ctx.init(b);
        return new type(type);
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
            res.append(">");
        } else if (!sch._) {
            res.append(sch + "");
            return;
        }
        Ctx.it(sch._, function(name, value) {
            Ctx.j2h(name, value, res);
        });
        if (sch._name) res.append("</" + sch._name + ">\n");
    },
    render: function (name, data, provider, cb) {
        name = name.replace(/\\/g, "/");
        try {
            var res = new Ctx.Res(provider);
            var str = Ctx.get(name).body(data, res);
            Ctx.j2h(null, str, res);
            cb(null, res.out);
        } catch (e) {
            cb(e, null);
        }
    }
};
if (typeof module !== 'undefined') {module.exports = Ctx;}
