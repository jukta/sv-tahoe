var Ctx = {
    anon: {}
};

Ctx.sync = function(cb) {
    var jobs = 0;
    this.await = function() {jobs++;};
    this.signal = function() {if (--jobs == 0) cb();}
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
            if (typeof b !== "undefined" && b._body) {
                body += b._body();
            } else {
                body += b;
            }
        }
        return body;
    };
};
Ctx.getBlock = function(name) {
    var ref = Ctx.schema[name];
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
            throw new Error("Could not find data provider " + bl.handler);
        }
        res = res.fork();
        var selfSync = this.sync;
        h(attrs, function(err, data) {
            if (err) throw err;
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
    var res = new Ctx.res(provider, new Ctx.sync(function() {
        cb(null, res._body());
    }));
    try {
        res._render(res.getBlock(name), data, res);
    } catch(e) {
        cb(e, null);
    }
};

if (typeof module !== 'undefined') {module.exports = Ctx;}
Ctx.schema = { "doc:index":{ body:function (attrs, res) {res.write('<html>');
res.write('<head>');
res.write('<meta content="text/html; charset=utf-8" http-equiv="content-type"/>');
res.write('<title>');
res.write('Doc Tahoe : base all');
res.write("</title>");
res.write('<meta name="date" content="2015-11-12"/>');
res.write('<link rel="stylesheet" type="text/css" href="doc.css" title="Style"/>');
res.write('<link rel="shortcut icon" href="favicon.png" type="image/png"/>');
res.write("</head>");
res.write('<body>');
res.write('<menu class="menu tahoe">');
res.write('<a href="doc_Tahoe-base_001.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_001.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_001.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_001.html">');
res.write('href');
res.write("</a>");
res.write("</menu>");
res.write('<menu class="menu link">');
res.write('<a class="active" href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write("</menu>");
res.write('<div>');
res.write('<span>');
res.write('Stranitcy');
res.write("</span>");
res.write('<h1>');
res.write('Pakety');
res.write("</h1>");
res.write("</div>");
res.write('<div>');
for (var lib in (attrs.schema.toc)) {
attrs['lib']=(attrs.schema.toc)[lib];
res.write('<h2 class="marg padd">');
res.write((attrs.lib.libName));
res.write("</h2>");
res.write('<ul class="marg2">');
for (var package in (attrs.lib.packages)) {
attrs['package']=(attrs.lib.packages)[package];
res.write('<li>');
res.write('<a href="#'+(attrs.package.packageName)+'">');
res.write((attrs.package.packageName));
res.write("</a>");
res.write("</li>");
};
res.write("</ul>");
};
res.write("</div>");
for (var lib in (attrs.schema.toc)) {
attrs['lib']=(attrs.schema.toc)[lib];
for (var package in (attrs.lib.packages)) {
attrs['package']=(attrs.lib.packages)[package];
res.write('<table>');
res.write('<caption>');
res.write('<h2 id="'+(attrs.package.packageName)+'">');
res.write((attrs.package.packageName));
res.write("</h2>");
res.write("</caption>");
res.write('<tr>');
res.write('<th>');
res.write('block');
res.write("</th>");
res.write('<th>');
res.write('description');
res.write("</th>");
res.write("</tr>");
for (var block in (attrs.package.blocks)) {
attrs['block']=(attrs.package.blocks)[block];
res.write('<tr>');
res.write('<td>');
attrs.name = attrs.package.packageName + ":" + attrs.block
                                            attrs.link = attrs.name.replace(/\//g, "_").replace(":", "_")+".html";
res.write('<a href="'+(attrs.link)+'">');
res.write((attrs.block));
res.write("</a>");
res.write("</td>");
res.write('<td>');
if ((attrs.schema.blocks[attrs.name].doc)) {
res.write((attrs.schema.blocks[attrs.name].doc));
};
res.write("</td>");
res.write("</tr>");
};
res.write("</table>");
};
};
res.write('<h2 class="hr">');
res.write('Annotation');
res.write("</h2>");
res.write('<pre class="p">');
res.write('Returns the one-based position of the distance from the top that the specified object exists on this stack, where the top-most element is considered to be at distance 1. If the object is not present on the stack, return -1 instead. The equals() method is used to compare to the items in this stack. Parameters: object - the object to be searched for Returns: the 1-based depth into the stack of the object, or -1 if not found');
res.write("</pre>");
res.write("</body>");
res.write("</html>");
} },
  "doc:block":{ body:function (attrs, res) {res.write('<html>');
res.write('<head>');
res.write('<meta content="text/html; charset=utf-8" http-equiv="content-type"/>');
res.write('<title>');
res.write('Doc Tahoe : base 001');
res.write("</title>");
res.write('<meta name="date" content="2015-11-12"/>');
res.write('<link rel="stylesheet" type="text/css" href="doc.css" title="Style"/>');
res.write('<link rel="shortcut icon" href="favicon.png" type="image/png"/>');
res.write("</head>");
res.write('<body>');
res.write('<menu class="menu tahoe">');
res.write('<a href="doc_Tahoe-base_000.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_000.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_000.html">');
res.write('href');
res.write("</a>");
res.write('<a href="doc_Tahoe-base_000.html">');
res.write('href');
res.write("</a>");
res.write("</menu>");
res.write('<menu class="menu link">');
res.write('<a class="active" href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write('<a href="">');
res.write('href');
res.write("</a>");
res.write("</menu>");
res.write('<div>');
res.write('<span>');
res.write('<span class="attr">');
res.write('pakage');
res.write("</span>");
res.write((attrs.block.package));
res.write("</span>");
res.write('<h1>');
res.write('<span class="attr">');
res.write('block');
res.write("</span>");
res.write((attrs.block.name));
res.write("</h1>");
res.write('<ul>');
if ((attrs.block.parent)) {
res.write('<li>');
attrs.link = attrs.block.parent.replace(/\//g, "_").replace(":", "_")+".html";
res.write('<a href="'+(attrs.link)+'">');
res.write((attrs.block.parent));
res.write("</a>");
res.write("</li>");
};
res.write('<li>');
res.write('<ul>');
res.write('<li class="'+(attrs.link ? "path" : "")+'">');
res.write('<a>');
res.write((attrs.block.package)+':'+(attrs.block.name));
res.write("</a>");
res.write("</li>");
res.write("</ul>");
res.write("</li>");
res.write("</ul>");
res.write('<h2>');
res.write('Definitions');
res.write("</h2>");
res.write('<table>');
res.write('<tr>');
res.write('<th>');
res.write('def');
res.write("</th>");
res.write('<th>');
res.write('description');
res.write("</th>");
res.write("</tr>");
for (var def in (attrs.block.defs)) {
attrs['def']=(attrs.block.defs)[def];
res.write('<tr>');
res.write('<td>');
res.write((attrs.def.name));
res.write("</td>");
res.write('<td>');
res.write((attrs.def.text));
res.write("</td>");
res.write("</tr>");
};
res.write("</table>");
res.write('<h2>');
res.write('Parameters');
res.write("</h2>");
res.write('<table>');
res.write('<tr>');
res.write('<th>');
res.write('def');
res.write("</th>");
res.write('<th>');
res.write('descr');
res.write("</th>");
res.write("</tr>");
for (var par in (attrs.block.params)) {
attrs['par']=(attrs.block.params)[par];
res.write('<tr>');
res.write('<td>');
res.write((attrs.par.name));
res.write("</td>");
res.write('<td>');
res.write((attrs.par.text));
res.write("</td>");
res.write("</tr>");
};
res.write("</table>");
res.write('<h2 class="hr">');
res.write('Annotation');
res.write("</h2>");
res.write('<pre class="p">');
res.write((attrs.block.doc));
res.write("</pre>");
res.write('<h2 class="hr">');
res.write('Child blocks');
res.write("</h2>");
res.write('<ul class="inline">');
res.write('<li>');
res.write('<a href="">');
res.write('privkniga/pages:page');
res.write("</a>");
res.write("</li>");
res.write("</ul>");
res.write('<h2 class="hr">');
res.write('Dependencies');
res.write("</h2>");
res.write('<ul>');
res.write('<li>');
res.write('<a href="">');
res.write('privkniga/pages/header:header');
res.write("</a>");
res.write("</li>");
res.write('<li>');
res.write('<a href="">');
res.write('privkniga/pages/footer:footer');
res.write("</a>");
res.write("</li>");
res.write("</ul>");
res.write("</div>");
res.write("</body>");
res.write("</html>");
} } }