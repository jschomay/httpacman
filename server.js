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
    random = 'http://www.randomwebsitemachine.com/random_website/';
    test = 'http://www.lonelyplanet.com/';
    request({url: (test || random), headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36'}}, function(err, response, body) {
      if(err) {
        console.log("error:", err.message);
      } else {
        host = response.request.uri.host;

        // parse for relative paths
        fixSrcUrls = /src=(["'])(?!(\/\/|http))\/?/gi;
        fixLinkUrls = /href=(["'])(?!(\/\/|http))\/?/gi;
        // nixScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        // nixSelfClosingScriptTags = /<script\b.*\/>/gi;
        body = body.replace(fixSrcUrls, 'src=$1http://'+host+'/');
        body = body.replace(fixLinkUrls, 'href=$1http://'+host+'/');
        // body = body.replace(nixScriptTags, '<!-- script removed -->');
        // body = body.replace(nixSelfClosingScriptTags, '<!-- script removed -->');
        // take out http-equiv="refresh"
        // <meta http-equiv="refresh" content="30; ,URL=http://www.metatags.info/login">

        // put our script in the code
        headOpen = /<head([^>]*)>/gi;
        body = body.replace(headOpen, '<head$1><script>(function(){var a={},b={},c=function(a,b){return{}.hasOwnProperty.call(a,b)},d=function(a,b){var d,e,c=[];d=/^\\.\\.?(\\/|$)/.test(b)?[a,b].join("/").split("/"):b.split("/");for(var f=0,g=d.length;g>f;f++)e=d[f],".."===e?c.pop():"."!==e&&""!==e&&c.push(e);return c.join("/")},e=function(a){return a.split("/").slice(0,-1).join("/")},f=function(a){return function(b){var c=e(a),f=d(c,b);return window.myRequire(f)}},g=function(a,c){var d={id:a,exports:{}};c(d.exports,f(a),d);var e=b[a]=d.exports;return e},h=function(e){var f=d(e,".");if(c(b,f))return b[f];if(c(a,f))return g(f,a[f]);var h=d(f,"./index");if(c(b,h))return b[h];if(c(a,h))return g(h,a[h]);throw Error(\'Cannot find module "\'+e+\'"\')},i=function(b,d){if("object"==typeof b)for(var e in b)c(b,e)&&(a[e]=b[e]);else a[b]=d};window.myRequire=h,window.myRequire.define=i,window.myRequire.register=i,window.myRequire.brunch=!0;window.require=window.myRequire})();</script><link rel="stylesheet" type="text/css" href="css/app.css"><script src="js/libs.js"></script><script src="js/app.js"></script><script>require(\'main\');window.currentUrl = "'+host+'";</script><base href="http://'+host+'/">');
        

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