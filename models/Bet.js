var mongoose = require('mongoose');

var betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    resultHome: {
        type: Number,
        default: 0
    },
    resultAway: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Bet', betSchema);