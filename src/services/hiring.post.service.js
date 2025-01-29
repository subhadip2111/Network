
const HiringPostModel = require('../Models/hiring.post.model');

// service to create a new hiring post
const createHiringPost = async (hiringPostData) => {
  try {
    const hiringPost = await HiringPostModel.create({...hiringPostData});
    return hiringPost;
  } catch (error) {
    throw new Error(`Error creating hiring post: ${error.message}`);
  }
};

// service to get all hiring posts
const viewAllHiringPosts = async (query,companyId) => {
  try {
    let page=query.page ||1;
    let pageSize=query.pageSize ||10;
    page = Math.max(1, parseInt(page, 10)); 
    pageSize = Math.max(1, parseInt(pageSize, 10));

    const skip = (page - 1) * pageSize;

    const hiringPosts = await HiringPostModel.find({companyId:companyId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    return hiringPosts;
  } catch (error) {
    throw new Error(`Error fetching hiring posts: ${error.message}`);
  }
};

// service to get a hiring post by id
const viewHiringPostById = async (id) => {
  try {
    const hiringPost = await HiringPostModel.findById(id);
    if (!hiringPost) {
      throw new Error(`Hiring post not found with id: ${id}`);
    }
    return hiringPost;
  } catch (error) {
    throw new Error(`Error fetching hiring post: ${error.message}`);
  }
};

// service to edit a hiring post
const editHiringPost = async (id, hiringPostData) => {
  try {
    const updatedHiringPost = await HiringPostModel.findByIdAndUpdate(id, hiringPostData, { new: true });
    if (!updatedHiringPost) {
      throw new Error(`Hiring post not found with id: ${id}`);
    }
    return updatedHiringPost;
  } catch (error) {
    throw new Error(`Error updating hiring post: ${error.message}`);
  }
};

// service to delete a hiring post
const deleteHiringPost = async (id) => {
  try {
    const hiringPost = await HiringPostModel.findByIdAndDelete(id);
    if (!hiringPost) {
      throw new Error(`Hiring post not found with id: ${id}`);
    }
    return hiringPost;
  } catch (error) {
    throw new Error(`Error deleting hiring post: ${error.message}`);
  }
};

module.exports = {
  createHiringPost,
  viewAllHiringPosts,
  viewHiringPostById,
  editHiringPost,
  deleteHiringPost,
};