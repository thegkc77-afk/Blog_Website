import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Edit,
  Trash2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const BlogCard = ({ blog, onDelete }) => {
  const { user } = useAuth();

  // Handle populated or string author reference
  const authorId = typeof blog.author === 'object' ? blog.author?._id : blog.author;
  const authorName = typeof blog.author === 'object' ? blog.author?.name : 'Anonymous User';
  const isOwner = user && user.id === authorId;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group">
      <div>
        {/* Category & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            {blog.category || 'General'}
          </span>

          {isOwner && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Your Post
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2.5 leading-snug">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>

        {/* Summary Excerpt */}
        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {blog.summary || (blog.content && blog.content.substring(0, 150) + '...')}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800/80 mt-2 space-y-3">
        {/* Author & Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow">
              {authorName.charAt(0)}
            </div>
            <span className="font-medium text-slate-300">{authorName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {blog.readTime || 1} min
            </span>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-between pt-1">
          <Link
            to={`/blogs/${blog._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>

          {/* Owner Quick Action Controls */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                title="Edit blog post"
              >
                <Edit className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(blog._id, blog.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete blog post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
