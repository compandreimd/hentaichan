// This JavaScript file runs on JXcore

var fs = require('fs');
var clog = require('./utilities').log;

clog("JXcore is up and running!");

Mobile('getBuffer').registerSync(function() {
  clog("getBuffer is called!!!");
  var buffer = new Buffer(25000);
  buffer.fill(45);

  // send back a buffer
  return buffer;
});

Mobile('asyncPing').registerAsync(function(message, callback){
  setTimeout(function() {
    callback("Pong:" + message);
  }, 500);
});

if (!fs.existsSync(__dirname + "/node_modules")) {
  clog("The node_modules folder not found. Please refer to www/jxcore/Install_modules.md");
  return;
}

var express = require('express');
var request = require('request');
var app = express();

app.get('/', function (req, res) {
        var url = "http://hentaichan.ru/" + req._parsedOriginalUrl._raw;
        request.get(url,{timeout:1500}).on("data",function(data){
                res.write(data);
        }).on("response",function(response){
            for(key in response.headers) res.setHeader(key,response.headers[key]);
        }).on("close", function () {
            res.end();
        }).on("timeout",function(){
            res.end();
        }).on("error", function (err) {
            res.end(err);
        }).on("end",function(){
            res.end();
        });//res.end();});
  clog("Request", req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress, new Date());
});

var server = app.listen(3000, function () {
  clog("Express server is started. (port: 3000)");
});

var os = require('os');
var net = os.networkInterfaces();

for (var ifc in net) {
  var addrs = net[ifc];
  for (var a in addrs) {
    if (addrs[a].family == "IPv4") {
      Mobile('addIp').call(addrs[a].address);
    }
  }
}
