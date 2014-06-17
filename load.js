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



/*
request.get('http://es.wikipedia.org/wiki/Equipos_participantes_en_la_Copa_Mundial_de_F%C3%BAtbol_de_2014', function(err, request, body) {
  if (err) return next(err);
  var $ = cheerio.load(body);
  $("li.toclevel-3").each(function() {
    console.log($(this).find("span.toctext").text());
     // Add find to create or update

     var team = new Team({teamName: $(this).find("span.toctext").text()});      
     team.save();
  });
}); */

var teams = Object.create(null);
request.get('http://www.bbc.co.uk/sport/football/world-cup/2014/schedule/group-stage', function(err, request, body) {
    if (err) return console.log(err);
    var $ = cheerio.load(body);
    var count = 0;
    $("li.fixture-list__item").each(function(i, html) {
        console.log(++count);
        if (!($(html).find(".home_team").text().trim() in teams))
            teams[$(html).find(".home_team").text().trim()] = true;
        if (!($(html).find(".away_team").text().trim() in teams))
            teams[$(html).find(".away_team").text().trim()] = true;
    });
});

setTimeout(function() {
    console.log(teams);
    for (var team in teams) {
      console.log(team);
      var obj = new Team({teamName: team});       
      obj.save();
    }
}, 5000 );


