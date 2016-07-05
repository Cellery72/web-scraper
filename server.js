var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile')
var file = './logs/data.json'

// make a request to the hardcoded link
request('http://www.hockey-reference.com/teams/PIT/2016.html', function(error, response, html) {
    if (!error && response.statusCode == 200) {

        // get html from cheerio
        var $ = cheerio.load(html);

        // array to hold each stat with name and tip
        var stats = [];

        $('#team_stats thead tr th').each(function(i, element) {
            // stat-name
            var statName = $(this).data('stat');
            // stat-tip
            var statTip = $(this).data('tip');

            // Our parsed meta data object
            var metadata = {
                name: statName,
                tip: statTip
            };

            // Push it to our results
            stats.push(metadata);
        });

        // Write the json to a file
        jsonfile.writeFile(file, parsedResults, function(err) {
            console.error(err)
        });
    }
});
