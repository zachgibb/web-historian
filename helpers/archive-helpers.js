var fs = require('fs');
var readline = require('readline');
var path = require('path');
var _ = require('underscore');
var reqHand = require('../web/request-handler.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'cronLog' : path.join(__dirname, '../workers/cronlog.txt'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(list, callback, endcallback){
  // read each line of file "list"
  var rd = readline.createInterface({
    input: fs.createReadStream(exports.paths.list),
    output: process.stdout,
    terminal: false
  });

  // on each line, do callback
  rd.on('line', function(line) {
    callback(line);
  });

  // after completion of file, call the endcallback
  rd.input.on('end', function(){
    if (endcallback) { endcallback(); }
    rd.close();
  });
};

exports.isUrlInList = function(url, list, callback){
  // defaults to false
  var result = false;

  // read each line of 'list'
  exports.readListOfUrls(list, function(line){

    // if desired url is in list
    if(line === url) {
      result = true;
    }
  }, function(){
    // at end of file, send the result to the callback
    callback(result);
  });
};

exports.addUrlToList = function(url, list, callback){
  // append url to 'list'
  fs.appendFile(list, url + '\n', function (err) {
    if (err) {
      console.log(err);
    }
    // after append, pass the url into the callback
    callback(url);
  });
};

exports.isURLArchived = function(url, callback){
  // check if a file 'url' exists in archives/sites/
  fs.exists(exports.paths.archivedSites + "/" + url, function (exists) {
    // pass true or false into the callback
    callback(exists);
  });
};

// didn't do anything for this one
exports.downloadUrls = function(){
};
