
var http = require('http');
var fs = require('fs');
var server = http.createServer();


server.on('request', function(req, res) {

  if(req.url === '/' && req.method === 'GET') {
    req.url = "/index.htm";
    } 

  fs.readFile(__dirname + "/../build" + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });

  
});

server.listen(8000);
