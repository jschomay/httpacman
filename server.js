var http = require('http');
var fs = require('fs');
var request = require('request');
var util = require('util');
var server = http.createServer();


server.on('request', function(req, res) {

  if(req.url === '/' && req.method === 'GET') {
    req.url = "/index.htm";
  } 


  

  // /play pulls a random url, all other requests for static content are served in else clase
  if(req.url === '/play' && req.method === "GET") {

    res.writeHead(200, { 'content-type': 'text/html'});
    // http://www.randomwebsitemachine.com/random_website/
    request({url:'http://www.randomwebsitemachine.com/random_website/', headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36'}}, function(err, response, body) {
      if(err) {
        console.log("error:", err.message);
      } else {
        host = response.request.uri.host;

        // parse for relative paths
        fixSrcUrls = /src=(["'])(?!http)\/?\/?/gi;
        fixLinkUrls = /href=(["'])(?!http)\/?\/?/gi;
        nixScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        nixSelfClosingScriptTags = /<script\b.*\/>/gi;
        body = body.replace(fixSrcUrls, 'src=$1http://'+host+'/');
        body = body.replace(fixLinkUrls, 'href=$1http://'+host+'/');
        // body = body.replace(nixScriptTags, '<!-- script removed -->');
        // body = body.replace(nixSelfClosingScriptTags, '<!-- script removed -->');
        // take out http-equiv="refresh"
        // <meta http-equiv="refresh" content="30; ,URL=http://www.metatags.info/login">

        // put our script in the code
        headOpen = /<head([^>]*)>/gi;
        body = body.replace(headOpen, '<head$1><link rel="stylesheet" type="text/css" href="css/app.css"><script src="js/libs.js"></script><script src="js/app.js"></script><script>require(\'main\');window.currentUrl = "'+host+'";</script>');
        

        // write 

        res.write(body);
        res.end();
      }
    });
  } else {

    // static content loading
    fs.readFile(__dirname + "/build" + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });

  }


});

server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8000, process.env.OPENSHIFT_NODEJS_IP || 'localhost');