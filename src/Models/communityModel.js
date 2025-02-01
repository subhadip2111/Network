const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const communitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{
    timestamps: true
});

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
