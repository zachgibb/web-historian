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

exports.serveAssets = function(res, asset) {
  var fileType = path.extname(asset);

  // if file type is not in the list of valid extensions, set response to html
  if (!validExtensions[fileType]) {
    fileType = '.html';
  }

  // read file at the place specified by 'asset'
  fs.readFile(asset, function (err, data) {

    // if can't read file
    if (err) {
      // tell them i don't know what happened
      reqHandler.sendResponse(res, "404 NOT FOUND, or 500 INTERNAL SERVER ERROR" + err, 404, {'Content-Type': validExtensions[fileType]});
    } else {
      // send them the data
      reqHandler.sendResponse(res, data, 200, {'Content-Type': validExtensions[fileType]});
    }

  });

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};
