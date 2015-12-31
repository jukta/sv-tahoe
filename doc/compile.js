var Compiler = require("../lib/compiler");

var cfg = {
    "tahoe": {
        "blocksDir": "template",
        "name": "doc"
    }
};

var comp = new Compiler(cfg);
comp.compile(function(err) {
    if (err) console.log(err);
});