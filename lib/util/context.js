var Ctx = {
    anon: {}
};

Ctx.sync = function(cb) {
    var jobs = 0;
    this.await = function() {jobs++;};
    this.signal = function() {if (--jobs == 0) cb();}
    this.error = function(err) {cb(err)}
};

Ctx.res = function(dataProvider, sync) {
    this.sync = sync;
    this.dataProvider = dataProvider;
    this.buffer = [];
    this.getBlock = Ctx.getBlock;
    this.init = Ctx.init;
    this._render = Ctx._render;

    this.write = function(str) {
        this.buffer.push(str);
    };
    this.fork = function() {
        var r = new Ctx.res(this.dataProvider, this.sync);
        this.buffer.push(r);
        return r;
    };

    this._body = function() {
        var idx = 0;
        var body = "";
        while (idx < this.buffer.length) {
            var b = this.buffer[idx++];
            if (typeof b !== "undefined" && b) {
                if (b._body) {
                    body += b._body();
                } else {
                    body += b;
                }
            }
        }
        return body;
    };
};
Ctx.getBlock = function(name) {
    var ref = Ctx.schema[typeof name === "function" ? name() : name];
    if (!ref) throw new Error("Could not find block: " + name);
    if (!ref.class) {
        ref = Ctx.init(null, ref);
    }
    return ref;
};
Ctx.init = function(seq, block) {
    var a;
    if (seq) {
        a = Ctx.anon[seq];
    }
    if (!a) {
        a = function() {};
        if (block.parent) {
            a.prototype = Object.create(Ctx.getBlock(block.parent).class.prototype);
        }
    }
    a.handler = block.handler;
    for (var f in block)
        if (typeof block[f] === "function") {
            a.prototype[f] = block[f];
        }

    var a1 = new a();
    a1.class = a;
    if (seq) Ctx.anon[seq] = a;
    return a1;
};
Ctx._render = function(bl, attrs, res) {
    this.sync.await();
    if(bl.class.handler && res.dataProvider) {
        var h = res.dataProvider.get(bl.class.handler);
        if (!h) {
            return selfSync.error(new Error("Could not find data provider " + bl.handler));
        }
        res = res.fork();
        var selfSync = this.sync;
        h(attrs, function(err, data) {
            if (err) return selfSync.error(err);
            bl.body(data, res);
            selfSync.signal();
        });
    } else {
        bl.body(attrs, res);
        this.sync.signal();
    }
};
Ctx.render = function(name, data, provider, cb) {
    name = name.replace(/\\/g, "/");
    var res = new Ctx.res(provider, new Ctx.sync(function(err) {
        if (err) return cb(err);
        cb(null, res._body());
    }));
    try {
        res._render(res.getBlock(name), data, res);
    } catch(e) {
        cb(e, null);
    }
};

if (typeof module !== 'undefined') {module.exports = Ctx;}
