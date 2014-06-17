var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
    id: {
        type: String,
        lowercase: true
    },
    gameTime: {
        type: Date
    },
    closeTime: {
        type: Date
    },
    teamHome: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    teamAway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    resultHome: {
        type: Number,
        default: 0
    },
    resultAway: {
        type: Number,
        default: 0
    },
    bets : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bet"        
    }]
});

module.exports = mongoose.model('Game', gameSchema);
