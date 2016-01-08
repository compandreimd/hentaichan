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

var http=require('./http');
var app=http(clog);
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
