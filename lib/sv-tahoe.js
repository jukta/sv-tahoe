var sv_tahoe = new function(){

    this.render = function(name, data, el) {
        Ctx.render(name, data, provider, function(err, html) {
            if (err) return console.error(err.message);
            SV.html(el, html);
        });
    };

    var provider = {
        get: function(handler) {
            return function(attrs, cb) {
                $.ajax({
                    type: 'POST',
                    url: '__tahoe/'+handler,
                    dataType: 'json',
                    async: true,
                    data: JSON.stringify(attrs)
                }).done(function(resp) {
                    cb(null, resp);
                });
            }
        }
    };

};

var SV = $.extend(SV, sv_tahoe);