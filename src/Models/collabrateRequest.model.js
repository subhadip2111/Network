const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollaborateRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedId: {
        type: Schema.Types.ObjectId,
        ref: 'Feeds',
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending'
    }
    
},{timestamps:true});

const collabrateRequstModel = mongoose.model('CollaborateRequest', CollaborateRequestSchema);
module.exports = collabrateRequstModel;  //export the model to use in other
