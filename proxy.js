var http = require('http');
var fs = require('fs');
var proxy = require('http-proxy').createProxyServer({});
var config = {}, ip = '127.0.0.1';

(function () {
  try {
    var str = fs.readFileSync('C:/Windows/System32/drivers/etc/hosts');
    var reg = /[0-9.]+\s+([0-9a-zA-Z.]+)#(\d+)([^\d]*)[\n\r]+/g;
    var m;
    while ((m = reg.exec(str)) !== null) {
      config[m[1]] = m[2];
      console.log(`转发到 ${ip}:${m[2]}\t 请求域名: ${m[1]}`);
    }
  } catch (err) {
    console.log(err.message);
  }
})();

// proxy.on(function (err, req, res) {
//   res.writeHead(500, {
//     'Content-Type': 'text/plain'
//   });
// });

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain;charset=utf-8'
  });
  res.end(new Buffer('代理服务器错误！'));
});
// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
var server = http.createServer(function (req, res) {
  var host = req.headers.host;
  //,ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 
  for (var k in config) {
    if (k === host) {
      //console.log(req.headers);
      proxy.web(req, res, { target: 'http://' + ip + ':' + config[k] });
      return;
    }
  }
  res.writeHead(200, {
    'Content-Type': 'text/plain;charset=utf-8'
  });
  res.end('Welcome to my server!');
});
console.log('代理服务器正在监听80端口!');
server.listen(80);

// 9.宕机
process.on('uncaughtException', (err) => {
  errorLogger.error(`uncaughtException ${err.toString()}`);
  console.error(err, 'uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  errorLogger.error(`unhandledRejection ${reason.toString()}`);
  console.error(reason, 'unhandledRejection');
});