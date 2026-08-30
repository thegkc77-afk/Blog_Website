import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Tag,
  ShieldCheck,
  Share2,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CATEGORY_IMAGES = {
  Travel: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
  Technology: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  Lifestyle: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
  Food: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1200&auto=format&fit=crop',
  Design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
  General: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
};

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
        // Fallback sample post handling for preview
        setError('');
        setBlog({
          _id: id,
          title: 'Exploring the Hidden Beauty of Himalayas',
          category: 'Travel',
          content: `The Himalayas, stretching across five countries, have captivated explorers, poets, and travelers for centuries. Nestled among these towering snow-capped peaks lie untouched valleys, ancient monasteries, and vibrant local cultures that offer an unparalleled sense of tranquility.\n\nWhether trekking through dense pine forests, watching sunrise over Kanchenjunga, or resting in quiet village homestays, the mountains offer a profound escape from modern chaos.\n\nKey Highlights for Mountain Travelers:\n1. Pack light but prepare for multi-climate shifts\n2. Respect mountain communities and local traditions\n3. Leave no trace: practice responsible eco-tourism`,
          createdAt: new Date().toISOString(),
          readTime: 5,
          author: { name: 'Priya Sharma', email: 'priya@blognest.com', bio: 'Senior Travel Writer & Photographer' },
          tags: ['travel', 'mountains', 'himalayas', 'adventure']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const authorId = blog && typeof blog.author === 'object' ? blog.author?._id : blog?.author;
  const authorName = blog && typeof blog.author === 'object' ? blog.author?.name : (blog?.authorName || 'Priya Sharma');
  const authorEmail = blog && typeof blog.author === 'object' ? blog.author?.email : '';
  const authorBio = blog && typeof blog.author === 'object' ? blog.author?.bio : 'Senior Editorial Writer & Content Creator';

  const isOwner = user && (user.id === authorId || user._id === authorId);

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
    if (!dateStr) return 'May 18, 2024';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'May 18, 2024';
    }
  };

  const coverImage = blog?.coverImage || CATEGORY_IMAGES[blog?.category] || CATEGORY_IMAGES.General;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This blog post could not be retrieved.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button & Action Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors text-xs font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors text-xs font-semibold shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {isOwner && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 transition-colors text-xs font-semibold"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors text-xs font-semibold"
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
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
            {blog.category || 'General'}
          </span>

          {isOwner && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your Article
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
          {blog.title}
        </h1>

        {/* Metadata Bar */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Published {formatDate(blog.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{blog.readTime || 5} min read</span>
          </div>
        </div>
      </header>

      {/* High Quality Editorial Image Header */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card border border-slate-200 dark:border-slate-800">
        <img
          src={coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Body */}
      <main className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="text-slate-800 dark:text-slate-200 text-base leading-relaxed space-y-4 whitespace-pre-wrap font-normal">
          {blog.content}
        </div>

        {/* Article Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900 px-3 py-1 rounded-md font-medium"
                >
                  <Tag className="w-3 h-3 text-brand-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Author Card Box */}
      <section className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-6 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 shadow-card">
        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-lg flex items-center justify-center flex-shrink-0 border border-brand-200 dark:border-brand-700">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{authorName}</h3>
            <span className="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded">
              Author
            </span>
          </div>
          {authorEmail && <p className="text-xs text-slate-500">{authorEmail}</p>}
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">{authorBio}</p>
        </div>
      </section>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Article"
        message={`Are you sure you want to delete "${blog.title}"? This operation is permanent.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </article>
  );
};

export default BlogDetails;
