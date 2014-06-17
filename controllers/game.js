/**
 * GET /
 * Home page.
 */
var Game = require('../models/Game.js');
var Team = require('../models/Team.js');
var Bet = require('../models/Bet.js');

function createBet(user, newBet) {
    Game.findOne({
        "id": newBet.id
    }, function(err, game) {
        Bet.findOne({
                'game': game,
                'user': user
            },

            function(err, bet) {
                if (err) console.log(err);
                if (newBet.home && newBet.home != '') {
                    if (!bet)
                        bet = new Bet();
                    bet.game = game;
                    bet.user = user;
                    bet.createdOn = Date.now();
                    bet.resultHome = newBet.home;
                    bet.resultAway = newBet.away;
                    bet.save(function(err, bet, numberAffected) {
                        if (err) console.log(err);
                    });
                    var isPresent = game.bets.some(function(compBet) {
                        return compBet.equals(bet.id)
                    });
                    console.log(isPresent);
                    if (!isPresent) {
                        game.bets.push(bet);
                        game.save(function(err, bet, numberAffected) {
                            if (err) console.log(err);
                        });
                        console.log(game);
                    }
                }
            })
    })

}

exports.postBets = function(req, res) {
    req.flash('success', {
        msg: 'Les apostes estan registrades!'
    });
    var bets = req.body.bets;
    console.log(bets);
    for (var i = 0; i < bets.length; i++) {
        createBet(req.user, bets[i]);
    }
    setTimeout(function() {
        res.redirect('/')
    }, 1000);

};

exports.getBets = function(req, res) {
    Game.findOne({
        "id": req.query.gameId
    }, function(err, game) {
        if (game.closeTime > Date.now()) 
            return false;
        else {
            Bet.find({
                game: game
            }).populate('user').exec(function(err, bets) {
                console.log(bets);
                res.render('game/bets', {
                    Bets: bets
                });
            })
            
        }
    })
}
