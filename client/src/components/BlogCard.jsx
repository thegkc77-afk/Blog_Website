import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Edit, Trash2, ArrowUpRight } from 'lucide-react';

const CATEGORY_IMAGES = {
  Travel: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  Technology: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
  Lifestyle: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  Food: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop',
  Design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
  General: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
};

const BlogCard = ({ blog, onDelete }) => {
  const { user } = useAuth();

  const authorId = typeof blog?.author === 'object' ? blog.author?._id : blog?.author;
  const authorName = typeof blog?.author === 'object' ? blog.author?.name : (blog?.authorName || 'Priya Sharma');
  const isOwner = user && (user.id === authorId || user._id === authorId);

  const formatDate = (dateString) => {
    if (!dateString) return 'May 18, 2024';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'May 18, 2024';
    }
  };

  const coverImage =
    blog?.coverImage ||
    CATEGORY_IMAGES[blog?.category] ||
    CATEGORY_IMAGES.General;

  return (
    <article className="editorial-card group flex flex-col justify-between overflow-hidden bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-navy-900">
          <img
            src={coverImage}
            alt={blog?.title || 'Blog cover'}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 dark:bg-navy-900/90 text-brand-700 dark:text-brand-300 backdrop-blur-md border border-white/20 shadow-sm">
              {blog?.category || 'General'}
            </span>
          </div>

          {/* Owner badge overlay */}
          {isOwner && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-500/90 text-white rounded-md backdrop-blur-md shadow-sm">
                Your Post
              </span>
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
            <Link to={`/blogs/${blog?._id}`}>{blog?.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {blog?.summary || blog?.content?.substring(0, 120) || 'Discover insights, story details, and engaging thoughts written by top creators.'}
          </p>
        </div>
      </div>

      {/* Footer Author & Meta Info */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-700 flex-shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-[110px] truncate">
            {authorName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(blog?.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {blog?.readTime || 5} min read
          </span>

          {/* Quick Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-1 pl-1">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title="Edit blog"
              >
                <Edit className="w-3.5 h-3.5" />
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(blog._id, blog.title)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete blog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
