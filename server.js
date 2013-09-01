var http = require('http');
var fs = require('fs');
var request = require('request');
var util = require('util');
var qs = require('querystring');
var server = http.createServer();
var url = require('url');

server.on('request', function(req, res) {


  // home page
  if(req.url === '/' && req.method === 'GET') {
    req.url = "/index.html";
  } 


  // any request besides one of our assets pulls a random url
  if(!req.url.match(/^\/(index.html|js|css|images)/)) {

    res.writeHead(200, { 'content-type': 'text/html'});
    
    /*********************************
    set this to test a specific page (use http:// prefix)
    *********************************/
    definedUrl = '';

    // if an url was provided as an url parameter (next level request), use that one
    var queryObject = url.parse(req.url,true).query;
    // console.log(queryObject);
    var body = "";
      req.on('data', function (chunk) {
        body += chunk;
      });
      req.on('end', function () {
        body = qs.parse(body);
        // console.log('POSTed: ' + JSON.stringify(body));
        if (queryObject.hhNextLevelUrl) {
          definedUrl = queryObject.hhNextLevelUrl;
          if (/^http/.test(definedUrl))
            console.log("Specific url requested:", definedUrl);
          else {
            console.log('PROBLEM WITH definedUrl:', definedUrl);
            currentUrl = url.parse(req.url, true).query.hhCurrentUrl;
            currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
            console.log('using requesting site base url instead:', currentUrlBase);
            definedUrl = currentUrlBase;
          }
        }
        getRandomSite(definedUrl);
      });

    getRandomSite = function(definedUrl) {
      var urlToRequest = !!definedUrl ? definedUrl : 'http://www.randomwebsitemachine.com/random_website/';
      request({url: (urlToRequest), headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36'}}, function(err, response, body) {
        if(err) {
          console.log("Error:", err.message);
          if(definedUrl) {
            currentUrl = url.parse(req.url, true).query.hhCurrentUrl;
            currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
            console.log('Error (general) trying to fetch specified url ('+definedUrl+'), using requesting site base url instead:', currentUrlBase);
            getRandomSite(currentUrlBase);
          } else
            getRandomSite();
        } else if (!body.match(/<head([^>]*)>/gi)) {
          // some sites don't have a <head> for what ever reason, so our code doesn't load, so... try again
          urlToRequest = response.request.uri.host + response.request.uri.pathname;
          redirect = (body.match(/location\.[^\(]+\("([^"]+)"\)/));
          if (redirect){
            redirect = redirect[1].replace(/\\/g, '');
            console.log("No head on this site, looks like it wants to redirect to",redirect);
            getRandomSite(redirect);
          } else {
            if(definedUrl) {
              currentUrl = url.parse(req.url, true).query.hhCurrentUrl;
              currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
              console.log('Error (no head) trying to fetch specified url ('+definedUrl+'), using requesting site base url instead:', currentUrlBase);
              getRandomSite(currentUrlBase);
            } else
              getRandomSite();
          }

        } else if (body.match(/<frameset([^>]*)>/gi)) {
          // some sites use framesets so our header bar and canvas doesn't load, so... try again
          urlToRequest = response.request.uri.host + response.request.uri.pathname;
          console.log("Error:", urlToRequest, " uses <framesets>");
          if(definedUrl) {
            currentUrl = url.parse(req.url, true).query.hhCurrentUrl;
            currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
            console.log('Error (frameset) trying to fetch specified url ('+definedUrl+'), using requesting site base url instead:', currentUrlBase);
            getRandomSite(currentUrlBase);
          } else
            getRandomSite();
        } else {
          host = response.request.uri.host;
          urlToRequest = response.request.uri.protocol + '//' + response.request.uri.host + response.request.uri.pathname;
          relativePath = urlToRequest.substring(0, urlToRequest.lastIndexOf('/')+1); // includes trailng slash
          console.log('requested url: '+req.url, '\nreturned url: '+urlToRequest);

          // parse for absolute paths (urls like href="/path...")
          // relative paths will work fine becase we set <base> to the current page below
          fixSrcUrls = /src=(["'])(?!(\/\/|http))\//gi;
          fixLinkUrls = /href=(["'])(?!(\/\/|http))\//gi;
          body = body.replace(fixSrcUrls, 'src=$1'+response.request.uri.protocol+'//'+host+'/');
          body = body.replace(fixLinkUrls, 'href=$1'+response.request.uri.protocol+'//'+host+'/');
          // take out http-equiv="refresh"
          body = body.replace(/<meta .*http-equiv="refresh".*\/>/, '');
          // put our script in the code
          headOpen = /<head([^>]*)>/gi;
          body = body.replace(headOpen, '<head$1><script src="js/myrequire.js"></script><link rel="stylesheet" type="text/css" href="css/app.css"><script src="js/libs.js"></script><script src="js/app.js"></script><script>require(\'main\');require = undefined;window.currentUrl = "'+urlToRequest+'";</script><base href="http://'+relativePath+'">');

          // write 
          res.write(body);
          res.end();
        }
      });
    };
  } else {

    // static content loading
    fs.readFile(__dirname + "/build" + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      var headerProps = {};
      if (req.url === '/index.html')
        headerProps = { 'content-type': 'text/html'};
      res.writeHead(200, headerProps);
      res.end(data);
    });

  }


});

server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8000, process.env.OPENSHIFT_NODEJS_IP || 'localhost');