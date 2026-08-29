const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
  deleteBlog,
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getAllBlogs)
  .post(protect, createBlog);

router.get('/user/me', protect, getUserBlogs);

router.route('/:id')
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
