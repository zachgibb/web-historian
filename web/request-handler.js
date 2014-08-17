var path = require('path');
var urlModule = require('url');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var _ = require('underscore');
// require more modules/folders here!

var validPaths = {
  "/": "/Users/zachgibb/Dropbox/Hack Reactor/web-historian/web/public/index.html",
  "/loading": "/Users/zachgibb/Dropbox/Hack Reactor/web-historian/web/public/loading.html",
};

exports.registerPath = function(url, pathToFile) {
  validPaths[url] = pathToFile;
};
exports.deregisterPath = function(url) {
  delete validPaths[url];
};

exports.sendResponse = function(response, data, status, headers) {
  status = status || 200;

  if (headers) {
    headers = _.extend({}, http.headers, headers);
  }

  headers = headers || http.headers;
  response.writeHead(status, headers);
  response.end(data);
};

// takes url, and if it is a valid path, serve the files there
exports.resolveUrl = function(response, url) {

  if(validPaths[url]) {
    http.serveAssets(response, validPaths[url]);
    
  } else {
    exports.sendResponse(response, '404 NOT FOUND', 404);
  }

};

var services = {
  'FILE': function(response, pathToFile){
    http.serveAssets(response, archive.paths['siteAssets'] + pathToFile);
  },
  'URL': function(response, url){
    exports.resolveUrl(response, url);
  },
  'TLD': function(response, url) {
    exports.resolveUrl(response, url);
  },
  'UNSUPPORTED': function(response) {
    exports.sendResponse(response, 'NOT A SUPPORTED MEDIA TYPE', 415);
  }
};


exports.handleRequest = function (req, res) {
  var baseUrl = urlModule.parse(req.url).pathname;
  // check if looking for a file, url, tld, or other
  var desires = http.desires(path.extname(req.url));

  console.log('\nServing ' + req.method + 
              '\n\tat ' + baseUrl + 
              '\n\tdesires a ' + desires
             );

  // if a get request
  if (req.method === "GET") {


    var serviceNeeded = services[desires];
    // serve the appropriate data (url, file, tld, etc)
    serviceNeeded(res, baseUrl);    


  // if post request, on the home or loading page
  } else if (req.method === "POST" && (baseUrl === "/" || baseUrl === "/loading")) {

    var body = "";
    var url;

    // deal with the data of the post
    req.on('data', function(data){
      body += data;
      // strip out "url="
      url = body.slice(4);

      // check if url is in the list 
      archive.isUrlInList(url, archive.paths.list, function(result) {

        // if url is not in list already, add it
        if (!result) {
          archive.addUrlToList(url, archive.paths.list, function(url){
            console.log('archived ', url);
          });
        }
      });
    });

    // after everything is finished
    req.on('end', function() {

      // check if the url has been assigned a path to the archived site
      if (validPaths["/"+url]) {

        // if so, send them to the archived site
        exports.resolveUrl(res, "/"+url);  

      // if the url has no path
      } else {
        // check if the site has been archived
        archive.isURLArchived(url, function(exists){
          // if it has, 
          if(exists) {
            // assign the archived site a path
            exports.registerPath("/"+url, archive.paths.archivedSites + "/" +url);
            // send them to the archived site
            exports.resolveUrl(res, "/"+url);  
          // else send them to the loading page
          } else {
            exports.resolveUrl(res, "/loading");
          }
        });
      }
    });


  // if is neither a post nor get request, 
  } else {
    exports.sendResponse(res, 'METHOD NOT ALLOWED', 405);
  }

};