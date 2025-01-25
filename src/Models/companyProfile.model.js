const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    otpCreatedAt: {
      type: Date,
      default: Date.now,
    },

    registrationNumber: {
      type: String,
      default: '',
      unique: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    headquarters: {
      type: String,
      trim: true,
      default: '',
    },
    founded: {
      type: Date,
      default: '',
    },
    size: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    logoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    socialLinks: {
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
    },
    email: {
      type: String,
      default: '',
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      default: '',
      trim: true,
    },
    hrEmails:{
        type:[String],
        default:[],
    },
    otp: {
      type: String,
      default: '',
      trim: true,
    },
  },


  {
    timestamps: true,
  }
);

// Hash password before saving
companySchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password verification method
companySchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

companySchema.pre('save', function (next) {
  if (this.isModified('otpCreatedAt') || this.isNew) {
    const now = new Date();
    const otpExpiryTime = new Date(this.otpCreatedAt.getTime() + 10 * 60000); // 10 minutes in milliseconds
    if (now > otpExpiryTime) {
      this.otp = '';
    }
  }
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
