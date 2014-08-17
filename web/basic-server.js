var http = require("http");
var handler = require("./request-handler");
var archive = require('../helpers/archive-helpers');

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);

// at the spin up of server, read list of urls, and for each
archive.readListOfUrls(archive.paths.list, function(line) {
  // if url is archived
  archive.isURLArchived(line, function(exists){
    if(exists) {
      // register path to the site
      handler.registerPath("/"+line, archive.paths.archivedSites + "/" +line);
    }
  });
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

