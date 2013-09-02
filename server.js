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


    gameOptions = {};

    // data is passed as url params
    var queryObject = url.parse(req.url,true).query;

    if (queryObject.hhCurrentUrl) {
      gameOptions.lastUrl = url.parse(req.url, true).query.hhCurrentUrl;
    }
    // see if a specific level has been requested
    if (queryObject.hhNextLevelUrl) {
      definedUrl = queryObject.hhNextLevelUrl;
      if (/^http/.test(definedUrl))
        console.log("Specific url requested:", definedUrl);
      else {
        console.log('PROBLEM WITH definedUrl:', definedUrl);
        currentUrl = url.parse(req.url, true).query.hhCurrentUrl; // assume there is a hhCurrentUrl if there is a hhNextLevelUrl
        currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
        console.log('using requesting site base url instead:', currentUrlBase);
        definedUrl = currentUrlBase;
      }
    }
    // set these if virus attack
    if(queryObject.hhVirus){
      var virusLevels = [
        'http://www.omfgdogs.com/',
        'http://www.hristu.net/',
        'http://www.fromthedarkpast.com/',
        'http://www.innerdoubts.com/',
        'http://www.sanger.dk/',
        'http://www.haneke.net/',
        'http://cat-bounce.com/',
        'http://www.theendofreason.com/',
        'http://www.wutdafuk.com/',
        'http://chickenonaraft.com/',
        'http://www.donothingfor2minutes.com/',
        'http://www.theworldsworstwebsiteever.com/',
        'http://www.nyan.cat/',
        'http://www.lee.org/reading/general/Hampsterdance/',
        'http://www.cat-gif.com/',
        'http://http//www.moredarkness.com/',
        'http://www.google.com/404'
      ];
      definedUrl = virusLevels[Math.floor(Math.random()*virusLevels.length)];
      gameOptions.specialLevel = 'virus';

      // every once in a while, show html code instead of a virus site
      if (!(Math.floor(Math.random()*6))) {
        var makeIntoCode = true;
        // show code for the site they were just on
        definedUrl = url.parse(req.url, true).query.hhCurrentUrl;
      }
    }
    getRandomSite(definedUrl);

    function getRandomSite(definedUrl) {
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
          console.log("Error: requested url uses <framesets>");
          if(definedUrl) {
            currentUrl = url.parse(req.url, true).query.hhCurrentUrl;
            currentUrlBase = url.parse(currentUrl).protocol + '//'+ url.parse(currentUrl).host;
            console.log('Error (frameset) trying to fetch specified url ('+definedUrl+'), using requesting site base url instead:', currentUrlBase);
            getRandomSite(currentUrlBase);
          } else
            getRandomSite();
        } else {
          returnedUrl = response.request.uri.protocol + '//' + response.request.uri.host + response.request.uri.pathname;
          host = response.request.uri.host;
          relativePath = returnedUrl.substring(0, returnedUrl.lastIndexOf('/')+1); // includes trailng slash
          console.log('requested url: '+req.url, '\nreturned url: '+returnedUrl);

          // parse for absolute paths (urls like href="/path...")
          // relative paths will work fine becase we set <base> to the current page below
          fixSrcUrls = /src=(["'])(?!(\/\/|http))\//gi;
          fixLinkUrls = /href=(["'])(?!(\/\/|http))\//gi;
          body = body.replace(fixSrcUrls, 'src=$1'+response.request.uri.protocol+'//'+host+'/');
          body = body.replace(fixLinkUrls, 'href=$1'+response.request.uri.protocol+'//'+host+'/');
          // take out http-equiv="refresh"
          body = body.replace(/<meta .*http-equiv="refresh".*\/>/, '');

          gameOptions.currentUrl = returnedUrl;

          // put our script in the code
          headOpen = /<head(\s[^>]*)?>/i;
          body = body.replace(headOpen, '<head$1><script src="js/myrequire.js"></script><link rel="stylesheet" type="text/css" href="css/app.css"><script src="js/libs.js"></script><script src="js/app.js"></script><script>require(\'main\');require = undefined;window.hhGameOptions = \''+JSON.stringify(gameOptions)+'\';</script><base href="'+relativePath+'">');


          // turn page into code
          if(typeof makeIntoCode !== "undefined") {
            bodyTag = /<body(\s[^>]*)?>/i;
            body = body.replace(bodyTag, '<body$1>|||||');
            bodyParts = body.split('|||||');
            bodyParts[1] = bodyParts[1].replace(/</g, '&lt;');
            bodyParts[1] = bodyParts[1].replace(/>/g, '&gt;');
            body = bodyParts.join('<pre style="width:100% height: 100%; overflow:hidden;font-size:12px;background:black;color:white;text-align:left;"><style>#hh-escape-link {color:#D56F11; * {background:black; color: white;}</style><code>');
          }

          // write 
          res.write(body);
          res.end();
        }
      });
    }

  // not /play route
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