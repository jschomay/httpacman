var http = require('http');
var fs = require('fs');
var request = require('request');
var util = require('util');
var server = http.createServer();


server.on('request', function(req, res) {

  if(req.url === '/' && req.method === 'GET') {
    req.url = "/index.html";
  } 

  // any request besides one of our assets pulls a random url
  if(!req.url.match(/^\/(index.html|js|css)/) && req.method === "GET") {

    res.writeHead(200, { 'content-type': 'text/html'});
    
    // set this to test a specific page (use http:// prefix)
    defineUrl = '';

    getRandomSite = function(defineUrl) {
      var url = !!defineUrl ? defineUrl : 'http://www.randomwebsitemachine.com/random_website/';
      request({url: (url), headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36'}}, function(err, response, body) {
        if(err) {
          console.log("Error:", err.message);
          getRandomSite();
        } else if (!body.match(/<head([^>]*)>/gi)) {
          // some sites don't have a <head> for what ever reason, so our code doesn't load, so... try again
          url = response.request.uri.host + response.request.uri.pathname;
          console.log("Error:", url, " has no <head>");
          getRandomSite();
        } else if (body.match(/<frameset([^>]*)>/gi)) {
          // some sites use framesets so our header bar and canvas doesn't load, so... try again
          url = response.request.uri.host + response.request.uri.pathname;
          console.log("Error:", url, " uses <framesets>");
          getRandomSite();
        } else {
          host = response.request.uri.host;
          url = response.request.uri.host + response.request.uri.pathname;
          relativePath = url.substring(0, url.lastIndexOf('/')+1); // includes trailng slash
          console.log(req.url, url);

          // parse for relative paths
          fixSrcUrls = /src=(["'])(?!(\/\/|http))\/?/gi;
          fixLinkUrls = /href=(["'])(?!(\/\/|http))\/?/gi;
          body = body.replace(fixSrcUrls, 'src=$1http://'+relativePath);
          body = body.replace(fixLinkUrls, 'href=$1http://'+relativePath);
          // take out http-equiv="refresh"
          // <meta http-equiv="refresh" content="30; ,URL=http://www.metatags.info/login">

          // put our script in the code
          headOpen = /<head([^>]*)>/gi;
          body = body.replace(headOpen, '<head$1><script src="js/myrequire.js"></script><link rel="stylesheet" type="text/css" href="css/app.css"><script src="js/libs.js"></script><script src="js/app.js"></script><script>require(\'main\');require = undefined;window.currentUrl = "'+url+'";</script><base href="http://'+relativePath+'">');

          // write 
          res.write(body);
          res.end();
        }
      });
    };
    getRandomSite(defineUrl);
  } else {

    // static content loading
    fs.readFile(__dirname + "/build" + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, { 'content-type': 'text/html'});
      res.end(data);
    });

  }


});

server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8000, process.env.OPENSHIFT_NODEJS_IP || 'localhost');