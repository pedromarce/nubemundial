var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
  teamName: { type: String },
  image: { type: Buffer },
  players: [{
    name: { type: String }
  }]
});

module.exports = mongoose.model('Team', teamSchema);