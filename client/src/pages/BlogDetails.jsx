import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  Tag,
  ShieldCheck,
  Share2,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Deletion Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await blogAPI.getById(id);
        setBlog(data.blog);
      } catch (err) {
        setError(err.message || 'Failed to load blog post details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const authorId = blog && typeof blog.author === 'object' ? blog.author?._id : blog?.author;
  const authorName = blog && typeof blog.author === 'object' ? blog.author?.name : 'Anonymous Author';
  const authorEmail = blog && typeof blog.author === 'object' ? blog.author?.email : '';
  const authorBio = blog && typeof blog.author === 'object' ? blog.author?.bio : 'Content Creator';

  const isOwner = user && user.id === authorId;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await blogAPI.delete(id);
      navigate('/my-blogs', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete blog');
      setDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading blog post...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Article Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'This blog post could not be retrieved.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button & Owner Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Strict Ownership Controls Display */}
          {isOwner && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors text-xs font-semibold"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Article</span>
              </Link>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header Info */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            {blog.category || 'General'}
          </span>

          {isOwner && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              You are the Author
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
          {blog.title}
        </h1>

        {/* Metadata bar */}
        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-2 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Published {formatDate(blog.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{blog.readTime || 1} min read</span>
          </div>

          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
            <span className="text-slate-500 italic">
              (Updated {formatDate(blog.updatedAt)})
            </span>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        {/* Render paragraphs cleanly */}
        <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed space-y-4 whitespace-pre-wrap font-normal">
          {blog.content}
        </div>

        {/* Article Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-800/80">
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3 tracking-wider">
              Topic Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg"
                >
                  <Tag className="w-3 h-3 text-indigo-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Author Card Box */}
      <section className="glass-card rounded-2xl p-6 border border-slate-800 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg flex-shrink-0">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100">{authorName}</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Author
            </span>
          </div>
          {authorEmail && <p className="text-xs text-indigo-400">{authorEmail}</p>}
          <p className="text-xs text-slate-400 leading-relaxed pt-1">{authorBio}</p>
        </div>
      </section>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Article"
        message={`Are you sure you want to delete "${blog.title}"? Backend authorization will permanently delete this post.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </article>
  );
};

export default BlogDetails;
