/**
 * GET /
 * Home page.
 */
var User = require('../models/User.js');
var Game = require('../models/Game.js');
var Team = require('../models/Team.js');
var async = require('async');

exports.index = function(req, res) {

        async.parallel({
                games: function(done) {
					Game.find().sort("gameTime").populate('teamHome teamAway bets').exec(function(err, games) {
						var bets = [];
						if (err) console.log(err);
				    	for (var i = 0; i < games.length; i++) {
						    bets[i] = {id: i};
						    for (var j = 0; j < games[i].bets.length; j++) {
						    	if (req.user && games[i].bets[j].user.equals(req.user._id)) {
						    		bets[i].home = games[i].bets[j].resultHome;
						    		bets[i].away = games[i].bets[j].resultAway;
						    	}		    		
						    }
				    	}
				    	done(err, {games: games, bets: bets});
					})
                },
                users: function(done) {
					User.find().exec(function(err, users) {
				    	done(err, users);
					})
                }
            },
            function(err, results) {
				res.render('home',{Games: results.games.games, Bets: results.games.bets, Users: results.users});
            }
        );


};
