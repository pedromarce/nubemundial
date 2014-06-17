/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({
    session: session
});
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');
var async = require('async');
var fs = require('fs');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var cheerio = require('cheerio');
var request = require('request');
var Team = require('./models/Team.js');
var Game = require('./models/Game.js');
/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */


/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

request.get('http://www.bbc.co.uk/sport/football/world-cup/2014/schedule/group-stage', function(err, request, body) {
    if (err) return console.log(err);
    var $ = cheerio.load(body);
    var count = 0;
    $("li.fixture-list__item").each(function(i, html) {
        console.log(++count);
        if ($(html).find(".link_to_match_report").attr('href'))
            var href = $(html).find(".link_to_match_report").attr('href').replace("/sport/football/","");
        else
            var href = $(html).find(".link_to_live").attr('href').replace("/sport/live/football/","");
        var datetime = new Date($(html).find("h3.fixture__date").text().replace("th"," ").replace("rd"," ").replace("st"," ").replace("nd "," ") + " 2014");
        var time = $(html).find(".fixture__number--time").text().split(":");
        if (time.length > 1) {
            datetime.setHours(time[0]);
            datetime.setMinutes(time[1]);
        } else {
            datetime.setHours(20);
            datetime.setMinutes(0);
        }
        async.parallel({
                teamHome: function(done) {
                    Team.findOne({
                        teamName: $(html).find(".home_team").text().trim()
                    }, function(err, obj) {
                        if (!obj) {
                          obj = new Team({teamName: $(html).find(".home_team").text().trim()});       
                          obj.save();
                        }
                        done(err, obj);
                    });
                },
                teamAway: function(done) {
                    Team.findOne({
                        teamName: $(html).find(".away_team").text().trim()
                    }, function(err, obj) {
                        if (!obj) {
                          obj = new Team({teamName: $(html).find(".away_team").text().trim()});       
                          obj.save();
                        }
                        done(err, obj);
                    });
                }
            },
            function(err, results) {
                if (err) console.log(err);
                Game.findOne({
                    id: href
                }, function (err, game) {
                    if (!game) 
                        game = new Game({id: href, teamHome : results.teamHome._id, teamAway : results.teamAway._id});
                    game.closeTime  = datetime - (15 * 60 * 1000);
                    game.gameTime   = datetime;
                    if ($(html).find(".home_score").text().trim()) {
                        game.resultHome = $(html).find(".home_score").text().trim();
                        game.resultAway = $(html).find(".away_score").text().trim();
                    }
                    game.save();    
                })
            }
        );
    });
});
