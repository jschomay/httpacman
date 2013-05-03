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
  request('http://www.uroulette.com/visit', function(err, response, body) {
    if(err) {
      console.log("error:", err.message);
    } else {
      // host = response.request.uri.host;
      host = 'TESTING_HOST'
      body = '<script>alert("BANG");</script>'+
      '<script src="killthings.js"/>'+
      '<img src="/start_with_slash.jpg">'+
      '<img src="start_with_no_slash.jpg">'+
      '<img src="http://local.com/start_with_http.jpg">'

      // parse for relative paths
      pattern1 = /src=(["'])(?!http)\/?/gi;
      pattern2 = /href=(["'])(?!http)\/?/gi;
      body = body.replace(pattern1, 'src=$1http://'+host+'/');
      body = body.replace(pattern2, 'href=$http://'+host+'/');


      // write 
      res.write(body);
      res.end();
    }

  });


});

server.listen(8000);
