const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollaborateSchema = new Schema({
    feedId: {
        type: Schema.Types.ObjectId,
        ref: 'Feed',
        required: true
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const collaborateModel = mongoose.model('Collaborate', CollaborateSchema);

module.exports = collaborateModel;

// when user  wnated to collabrate oi join then send root or created user a email that he wantes to colabrate with you ..
// a projet team can rasie any ticket related to their think and throughts . and admin can help them with a like TA .