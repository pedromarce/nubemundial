var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        lowercase: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    points: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        default: 0
    },
    goalDifference: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Group', groupSchema);
