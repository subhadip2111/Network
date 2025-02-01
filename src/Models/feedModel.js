const mongoose = require('mongoose');
// here I can name this model as post model as my choice i define it as feed model. becasuse the created post  can comes as  feed other targeted users
// that's why I named it as feed model

const FeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    feedType: {
      type: String,
      enum: ['article', 'idea', 'resources', 'project','query'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
      match: [/^https?:\/\/.+/, 'Invalid URL'],
    },
    links: [{
      type: String,
      trim: true,
      default: '',
      match: [/^https?:\/\/.+/, 'Invalid URL'],
    }],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    targetProfileTypes: {
      type: [String],
      enum: ['student', 'beginner', 'intermediate', 'experienced'],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    
  },    
  { timestamps: true }
);

const FeedModel = mongoose.model('Feeds', FeedSchema);

module.exports = FeedModel;
