const Blog = require('../models/Blog');

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Authenticated users only)
const createBlog = async (req, res, next) => {
  try {
    const { title, content, summary, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    // Auto-generate summary if not provided
    const autoSummary =
      summary ||
      (content.length > 150 ? content.substring(0, 147) + '...' : content);

    // Process tags array
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim().length > 0) {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const blog = await Blog.create({
      title,
      content,
      summary: autoSummary,
      category: category || 'General',
      tags: parsedTags,
      author: req.user.id,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      'author',
      'name email bio'
    );

    res.status(201).json({
      success: true,
      message: 'Blog published successfully!',
      blog: populatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs (with optional search/category filter)
// @route   GET /api/blogs
// @access  Public / Authenticated
const getAllBlogs = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public / Authenticated
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email bio'
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blogs created by currently logged-in user
// @route   GET /api/blogs/user/me
// @access  Private (Authenticated users only)
const getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name email bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post (OWNER ONLY)
// @route   PUT /api/blogs/:id
// @access  Private (Blog Owner only)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // STRICT AUTHORIZATION CHECK: Enforce backend ownership check
    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this blog. Only the original author can edit it.',
      });
    }

    const { title, content, summary, category, tags } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;

    if (summary !== undefined) {
      blog.summary = summary;
    } else if (content) {
      blog.summary = content.length > 150 ? content.substring(0, 147) + '...' : content;
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        blog.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        blog.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id).populate(
      'author',
      'name email bio'
    );

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully!',
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post (OWNER ONLY)
// @route   DELETE /api/blogs/:id
// @access  Private (Blog Owner only)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // STRICT AUTHORIZATION CHECK: Enforce backend ownership check
    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this blog. Only the original author can delete it.',
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
  deleteBlog,
};
