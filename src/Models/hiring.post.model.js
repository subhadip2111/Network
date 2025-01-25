const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HiringPostSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companies',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  postedDate: {
    type: Date,
    default: Date.now,
  },
  projectDemo: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    repositoryLink: {
      type: String,
      required: true,
    },
    technologiesUsed: [
      {
        type: String,
        required: true,
      },
    ],
    guidelines: {
      type: String,
      required: true,
    },
    expectedOutcome: {
      type: String,
      required: true,
    },
    submissionDeadline: {
      type: Date,
default: Date.now,      
    },
  },
  evaluationCriteria: {
    type: [String],
    required: true,
  },
  submissionInstructions: {
    type: String,
    required: true,
  },
  faqs: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  additionalInfo: {
    type: String,
  },
});

const HiringPostModel = mongoose.model('HiringPost', HiringPostSchema);
module.exports = HiringPostModel;
