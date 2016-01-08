var request = require('request');
request=request.defaults({jar:true}); //for memorize cookie
var http=require('http');
var qs=require('querystring');
function http_f(clog) {
    var app = http.createServer(function (req, res) {
        var url = "http://hentaichan.ru/" + req.url;
        clog(req.method+":"+url);
        if (req.method == "POST") {
            var body = "";
            req.on('data', function (data) {
                body += data.toString();

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            req.on('end', function () {
                var form = qs.parse(body);

                request.post(url, {form: form}).on("data", function (data) {
                    res.write(data);
                }).on("response", function (response) {
                    for (var key in response.headers) res.setHeader(key, response.headers[key]);
                }).on("close", function () {
                    res.end();
                }).on("timeout", function () {
                    res.end();
                }).on("error", function (err) {
                    clog(err);
                }).on("end", function () {
                    res.end();
                });
            });
        } else {

            request.get(url, {timeout: 15000}).on("data", function (data) {
                res.write(data);
            }).on("response", function (response) {
                for (key in response.headers) res.setHeader(key, response.headers[key]);
            }).on("close", function () {
                res.end();
            }).on("timeout", function () {
                res.end();
            }).on("error", function (err) {
               // next(err);
                clog(err);
            }).on("end", function () {
                res.end();
            });
        }
    });
    return app;
}
module.exports = http_f;
