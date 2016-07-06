var express = require('express');
var app = express();
var port = 3000;
var scraper = require('./scraper').Scraper;

scraper.createTeam('PIT',2016);

app.listen(port);
console.log('Listen on port ' + port);
