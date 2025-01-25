const mongoose = require('mongoose');
const argon2 = require('argon2');
const { number } = require('joi');

const ContributorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    default: '',
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
});

// Sub-schema for projects
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
  },

  description: {
    type: String,
    trim: true,
    default: '',
  },
  projectUrl: {
    type: String,
    trim: true,
    default: '',
    match: [/^https?:\/\/.+/, 'Invalid URL'],
  },
  contributors: [ContributorSchema],
});

// Main User schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      default: '',
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    projects: [ProjectSchema],
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    about: {
      type: String,
      trim: true,
      default: '',
    },

    activityStatus: {
      type: String,
      enum: ['looking for job', 'employed', 'freelancing', 'inactive'],
      default: 'looking for job',
    },
    comapnyList: [
      {
        name: {
          type: String,
          trim: true,
          default: '',
        },
        from: {
          type: Date,
          trim: true,
          default: '',
        },
        to: {
          type: Date,
          trim: true,
          default: '',
        },
        role: {
          type: String,
          trim: true,
          default: '',
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    otp: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: null,
    },

    interest: {
      type: String,
      default: '',
    },
    jobPreferences:[ {
      type: String,
      default: '',
    }],
  },
  { timestamps: true }
);

const userModels = mongoose.model('User', UserSchema);

module.exports = userModels;
