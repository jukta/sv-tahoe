var tags = {
    block: require("../tags/block"),
    root: require("../tags/root"),
    def: require("../tags/def"),
    parent: require("../tags/parent"),
    include: require("../tags/include"),
    __html: require("../tags/html"),
    script: require("../tags/script"),
    for: require("../tags/for"),
    if: require("../tags/if"),
    import: require("../tags/import"),
    func: require("../tags/func"),
    tag: require("../tags/tag"),
    tagAttr: require("../tags/tagAttr"),
    set: require("../tags/set"),

    getTag: function(ctx, node, parent) {
        var m = node.name.split(":");
        var pr = m[0];
        var fn = m[1];
        var t;
        if (tags[fn] && typeof tags[fn] === 'function' ) {
            t = tags[fn];
        } else if (!fn) {
//            for (var f in ctx.prefixes) {
//                var tName = ctx.prefixes[f] + ":" + pr;
//                if (ctx.schema[tName]) {
//                    t = tags.func;
//                    break;
//                }
//            }
        } else if (pr && fn) {
            var tName = ctx.prefixes[pr] + ":" + fn;
            if (ctx.schema[tName]) {
                t = tags.func;
            } else {
                throw new Error("Could not find: " + tName);
            }
        }
        if (t == null) {
            t = tags.__html;
        }
        var inst = new t();
        inst.init(ctx, node, parent);
        return inst;
    }

};

module.exports = {
    schema: tags
};