var http = require('http');
var fs = require('fs');
var request = require('request');
var util = require('util');
var server = http.createServer();


server.on('request', function(req, res) {

  // if(req.url === '/' && req.method === 'GET') {
  //   req.url = "/index.htm";
  // } 


  // fs.readFile(__dirname + "/../build" + req.url, function (err,data) {
  //   if (err) {
  //     res.writeHead(404);
  //     res.end(JSON.stringify(err));
  //     return;
  //   }
  //   res.writeHead(200);
  //   res.end(data);
  // });

  res.writeHead(200, { 'content-type': 'text/html'});
  request('http://www.randomwebsite.com/cgi-bin/random.pl', function(err, response, body) {
    if(err) {
      console.log("error:", err.message);
    } else {
      host = response.request.uri.host;



      // parse for relative paths
      pattern1 = /src=["']\/?/gi;
      pattern2 = /href=["']\/?/gi;
      body = body.replace(pattern1, 'src="http://'+host+'/');
      body = body.replace(pattern2, 'href="http://'+host+'/');


      // write 
      res.write(body);
      res.end();
    }

  });


});

server.listen(8000);
