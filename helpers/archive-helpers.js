var fs = require('fs');
var readline = require('readline');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
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
fs.appendFile(exports.paths.list, 'www.test.com\n', function (err) {
  console.log(err);
});
var rd = readline.createInterface({
    input: fs.createReadStream(exports.paths.list),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
    console.log(line);
});

exports.readListOfUrls = function(list){
  fs.readFile(list, function (err, data) {
    if (err) {
      console.log(err);
    }
    var body = "";
    body += data;
    console.log(body);
  });
};
exports.isUrlInList = function(url, list){
};

exports.addUrlToList = function(url, list){
};

exports.isURLArchived = function(url){
};

exports.downloadUrls = function(){
};
