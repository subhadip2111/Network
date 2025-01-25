// import { createHiringPost } from '../services/hiring.post.service';
// import { findUsersForHiringPost } from '../services/userService';
// import ApiError from '../Utils/ApiError';
// import ApiSuccess from '../Utils/ApiSuccess';
const {createHiringPost} = require('../services/hiring.post.service.js');
const {  sendDeveloperEmailForNewAssessmentSharedByCompany } = require('../services/emailService.js');
const ApiError = require('../Utils/ApiError');
const ApiSuccess = require('../Utils/ApiSuccess');
const { findComapnyById } = require('../services/companyprofileService');
const logger = require('../Utils/logger.js');
const { hiringPostValidation } = require('../validation/hiringPostValidation.js');
const { findUsersForHiringPost } = require('../services/userService.js');

const createPost = async (req, res) => {
    logger.info('createPost api called');
    
    const companyId = req.user.userId;
    
    try {
      // Find the company by ID
      const findCompany = await findComapnyById(companyId);
      if (!findCompany) {
        throw new ApiError(404, 'Company not found');
      }
  
      // Validate the hiring post request body
      const { error } = hiringPostValidation(req.body);
      if (error) {
        throw new ApiError(400, error.details[0].message);
      }
  
      console.log("Request Body:", req.body);
  
      // Create the hiring post
      const hiringPost = await createHiringPost(req.body);
      const userList = await findUsersForHiringPost(hiringPost.title, hiringPost.description);
  
      console.log("User List:", userList);
  
      // Ensure no duplicate users (based on email) in the list
      const uniqueUsers = [...new Set(userList.map(user => user.email))];
      
      // Check if any users matched
      if (uniqueUsers.length > 0) {
        // Map over the unique user list and send emails asynchronously
        const emailPromises = uniqueUsers.map(async (userEmail) => {
          try {
            await sendDeveloperEmailForNewAssessmentSharedByCompany(
              userEmail,
              findCompany.name,
              hiringPost.title,
              hiringPost.description,
              hiringPost.repositoryLink,
              hiringPost.submissionDeadline,
              findCompany.email, // Corrected here
              findCompany.hrEmails // Corrected here
            );
            console.log(`Email sent successfully to: ${userEmail}`);
          } catch (emailError) {
            console.error(`Error sending email to ${userEmail}:`, emailError);
          }
        });
  
        // Wait for all emails to be sent
        await Promise.all(emailPromises);
      }
  
      // Return success response
      return new ApiSuccess(res, 201, 'Hiring post created successfully', hiringPost);
  
    } catch (error) {
      console.error('Error creating hiring post:', error);
      
      // Return error response
      return new ApiError(500, 'An error occurred while creating the hiring post.');
    }
  };
  

const viewAllPosts = async () => {};
const viewPost = async (postId) => {};
const editPost = async (postId) => {};
const deletePost = async (postId) => {};
module.exports=  { createPost, viewAllPosts, viewPost, editPost, deletePost };
