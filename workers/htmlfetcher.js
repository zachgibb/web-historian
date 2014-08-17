// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
// * * * * * /usr/local/bin/node /Users/zachgibb/Dropbox/Hack\ Reactor/web-historian/workers/htmlfetcher.js
var archive = require('../helpers/archive-helpers');
var reqHandler = require('../web/request-handler');
var http = require('http-request');
var fs = require('fs');

fs.appendFile(archive.paths.cronLog, '\nHTML SCRAPER START');

// read list of urls in sites.txt
archive.readListOfUrls(archive.paths.list, function(line){
  // for each url, check if archived
  archive.isURLArchived(line, function(exists){
    // if it is, log that url exists
    if(exists){
      fs.appendFile(archive.paths.cronLog, '\nURL already archived: ' + line);

    // if it isn't archived
    } else {
      // make a GET request to the url
      http.get({
        url: line,

      // upon response
      }, function(err, result){
        // if error, log the error
        if (err) {
          fs.appendFile(archive.paths.cronLog, '\nError archiving URL ' + err);
        // else
        } else {
          // write the data to sites/www.site.com
          fs.writeFile(archive.paths.archivedSites + "/" + line, result.buffer, function (err) {
            // if error, log error
            if (err){
              fs.appendFile(archive.paths.cronLog, '\nError writing to file: ' + err);
            // else log success and add url to request handler's valid paths
            } else{
              fs.appendFile(archive.paths.cronLog, '\nURL newly archived: ' + line);
            }
          });
        }
      });
    }
  });
}, function(){
  // ON END

});