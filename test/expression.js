var exp = require("../lib/expression.js");

var check = function(str, expect, test) {
    var res = exp.resolveStr(str, "'");
    console.log("\tIncome  : " + str);
//    console.log("\tExpected: " + expect);
//    console.log("\tResult  : " + res);
    test.equal(res, expect);
    test.done();
};

module.exports = {
    "str": function(test) {
        var str = "hello";
        var expect = "'hello'";
        check(str, expect, test);
    },
    "simple var": function(test) {
        var str = "${hello}";
        var expect = "(ctx.attrs.hello)";
        check(str, expect, test);
    },
    "str and var": function(test) {
        var str = "s ${x}";
        var expect = "'s '+(ctx.attrs.x)";
        check(str, expect, test);
    },
    "var and str": function(test) {
        var str = "${x} s";
        var expect = "(ctx.attrs.x)+' s'";
        check(str, expect, test);
    },
    "multiple": function(test) {
        var str = "${x} ${y} s ${z}";
        var expect = "(ctx.attrs.x)+' '+(ctx.attrs.y)+' s '+(ctx.attrs.z)";
        check(str, expect, test);
    },
    "if expression": function(test) {
        var str = "${x == false ? y : z}";
        var expect = "(ctx.attrs.x == false ? ctx.attrs.y : ctx.attrs.z)";
        check(str, expect, test);
    },
    "sum expression": function(test) {
        var str = "${x + 1}";
        var expect = "(ctx.attrs.x + 1)";
        check(str, expect, test);
    }

};