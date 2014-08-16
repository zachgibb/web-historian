var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var reqHandler = require('./request-handler');
var validTLDs = require('./tlds');

// PRIVATE VARIABLES/FUNCTIONS (though some may be exported for now.)

var validExtensions = {
  ".html" : "text/html",      
  ".js": "application/javascript", 
  ".css": "text/css",
  ".txt": "text/plain",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".png": "image/png",
  ".ico": "image/x-ico"
};

// EXPORTED FUNCTIONS/VARIABLES

exports.registerExtension = function(ext, mediaType) {
  validExtensions[ext] = mediaType;
};
exports.deregisterExtension = function(ext) {
  delete validExtensions[ext];
};

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.desires = function(extension) {
  if(extension === '') {
    return 'URL';
  } else if (validExtensions[extension]) {
    return 'FILE';
  } else if (validTLDs.tlds[extension.toUpperCase()]) {
    return 'TLD'
  } else {
    return 'UNSUPPORTED';
  }
};

exports.serveAssets = function(res, asset, callback) {
  var fileType = path.extname(asset);
  if (!validExtensions[fileType]) {
    fileType = '.html';
  }
  console.log('file located: ' + asset);

  fs.readFile(asset, function (err, data) {

    if (err) {
      console.log('couldn\'t read file');
      reqHandler.sendResponse(res, "UNKNOWN ERROR: " + err, 500, {'Content-Type': validExtensions[fileType]});
    } else {
      reqHandler.sendResponse(res, data, 200, {'Content-Type': validExtensions[fileType]});
    }

  });

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};
