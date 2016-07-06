var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var mkdirp = require('mkdirp');
var stats_file = './output/stats_file.json',
    team_file = './output/team_file.json',
    roster_file = './output/roster_file.json';

// Init Scraper
var Scraper = function(){};

// Create Team Function ( Team, Year )
// creates json output of the stats for that team
Scraper.prototype.createTeam = function(team, year) {

    // construct URL
    var url = 'http://www.hockey-reference.com/teams/' + team + '/' + year + '.html';

    // make a request to the URL
    request(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {

            // get html from cheerio
            var $ = cheerio.load(html);

            // array to hold each stat with name and tip
            var stats = [];
            // array to hold team(s) stats
            var teams = [];
            // array to hold players
            var roster = [];

            // for each table header item in TEAM STATS
            $('#team_stats thead tr th').each(function(i, element) {

                // metadata object to hold variables
                var metadata = {};
                // stat-name
                metadata['stat_name'] = $(this).data('stat');
                // stat-tip
                metadata['stat_tip'] = $(this).data('tip');
                // Push it to our results
                stats.push(metadata);
            });

            // for each table row in TEAM STATS
            $('#team_stats tbody tr').each(function(i, element) {

                // new object to hold team values
                var team = {};

                // our row
                row = $(this).children();

                // iterate through children of Row
                for (var i = 0; i < row.length; ++i) {
                    // Set Stat-Name and Value
                    team[row.eq(i).data('stat')] = row.eq(i).text();
                }

                // push current team to array of teams
                teams.push(team);
            });

            // for each table row header item in ROSTER
            $('#roster tbody tr').each(function(i,element){
                var player = {};

                // our row
                row = $(this).children();

                // iterate through children of Row
                for (var i = 0; i < row.length; ++i) {
                    // Set Stat-Name and Value
                    player[row.eq(i).data('stat')] = row.eq(i).text();
                }

                // push current team to array of teams
                roster.push(player);


            });

            // Write the json objects to a file(s)
            jsonfile.writeFile(stats_file, stats, function(err) {
                if (err)
                    console.log(err);
                else {
                    console.log('Just wrote ' + stats_file + ' .. check it out yo');
                }
            });
            jsonfile.writeFile(team_file, teams, function(err) {
                if (err)
                    console.log(err);
                else {
                    console.log('Just wrote ' + team_file + ' .. check it out yo');
                }
            });
            jsonfile.writeFile(roster_file, roster, function(err) {
                if (err)
                    console.log(err);
                else {
                    console.log('Just wrote ' + roster_file + ' .. check it out yo');
                }
            });
        }
        else if(error) {
          console.log(error);
        }
    });
};

exports.Scraper = new Scraper();
