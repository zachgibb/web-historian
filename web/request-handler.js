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

exports.resolveUrl = function(response, url) {

  if(validPaths[url]) {
    http.serveAssets(response, validPaths[url], function() {
      console.log('calledback!');
    });
    
  } else {
    exports.sendResponse(response, '404 NOT FOUND', 404);
  }

};

var services = {
  'FILE': function(response, pathToFile){
    http.serveAssets(response, archive.paths['siteAssets'] + pathToFile, function() {
      console.log('calledback!');
    });
  },
  'URL': function(response, url){
    exports.resolveUrl(response, url);
  },
  'TLD': function(response, url) {
    exports.sendResponse(response, 'here i will need to route to cached sites', 200);
  },
  'UNSUPPORTED': function(response) {
    exports.sendResponse(response, 'NOT A SUPPORTED MEDIA TYPE', 415);
  }
};


exports.handleRequest = function (req, res) {
  var baseUrl = urlModule.parse(req.url).pathname;
  var desires = http.desires(path.extname(req.url));

  console.log('\nServing ' + req.method + 
              '\n\tat ' + baseUrl + 
              '\n\tdesires a ' + desires
             );
  if (req.method === "GET") {

    var serviceNeeded = services[desires];
    serviceNeeded(res, baseUrl);    



  } else if (req.method === "POST" && baseUrl === "/") {


    console.log('trying to post from the home');
    var body = "";
    req.on('data', function(data){
      body += data;
      console.log(body.slice(4));
    });
    req.on('end', function() {
      exports.sendResponse(res, 'nice try, posting there', 200);
    });

  } else {
    exports.sendResponse(res, 'METHOD NOT ALLOWED', 405);
  }

};