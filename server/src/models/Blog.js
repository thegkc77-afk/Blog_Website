const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      minlength: [10, 'Content must be at least 10 characters long'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Technology', 'Design', 'Lifestyle', 'Programming', 'Business'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for estimated reading time in minutes
blogSchema.virtual('readTime').get(function () {
  if (!this.content) return 1;
  const wordsPerMinute = 200;
  const wordCount = this.content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
});

module.exports = mongoose.model('Blog', blogSchema);
