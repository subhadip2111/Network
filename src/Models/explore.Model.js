// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const ExploreSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//       default: '',
//     },
//     category: {
//       type: String,
//       trim: true,
//       required: true,
//       enum: ['technology', 'science', 'history', 'education', 'literature', 'business', 'others'], // Expand as needed
//     },
//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//     docs: [
//       {
//         type: String,
//         required: true, // Ensure at least one document link
//         trim: true,
//       },
//     ],
//     images: [
//       {
//         type: String,
//         trim: true,
//         default: '',
//       },
//     ],
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to User model
//       required: true,
//     },
//     views: {
//       type: Number,
//       default: 0, // Track how many times this has been explored
//     },
//   },
//   { timestamps: true } // Auto-created `createdAt` & `updatedAt`
// );

// module.exports = mongoose.model('Explore', ExploreSchema);
