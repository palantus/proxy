var http = require('http'),
	https = require('https'),
    httpProxy = require('http-proxy'),
    config = require('../proxyconfig.json'),
    fs = require("fs");

var proxy = httpProxy.createProxyServer({});

proxy.on('error', function(e) {
  console.log(e);
});

function onRequest(req, res){
	console.log(req.headers.host)
  if(config.routes[req.headers.host] !== undefined){
  	proxy.web(req, res, { target: config.routes[req.headers.host] });
  } else if(config.routes["default"] !== undefined){
	proxy.web(req, res, { target: config.routes["default"] });
  } else {
  	console.log("Missing route: " + req.headers.host);
  }
}

var server = http.createServer(onRequest);
server.listen(process.env.port || config.port || 3000);

if(config.enableSSL == true && !isNaN(config.SSLPort)){
	var options = {
		key: fs.readFileSync(config.SSLKey),
		cert: fs.readFileSync(config.SSLCert),
		ca: fs.readFileSync(config.SSLCa),
		requestCert: false,
		rejectUnauthorized: false
	};

	https.createServer(options,onRequest).listen(config.SSLPort || 3001);
}