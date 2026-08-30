import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import { Feather, PenSquare, FileText, Clock, AlertCircle } from 'lucide-react';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State for deleting
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: '',
    isDeleting: false,
  });

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await blogAPI.getUserBlogs();
      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      blogId: id,
      blogTitle: title,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, blogId: null, blogTitle: '', isDeleting: false });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await blogAPI.delete(deleteModal.blogId);
      setBlogs(blogs.filter((b) => b._id !== deleteModal.blogId));
      closeDeleteModal();
    } catch (err) {
      alert(err.message || 'Failed to delete blog');
      closeDeleteModal();
    }
  };

  const totalPosts = blogs.length;
  const totalReadTime = blogs.reduce((acc, curr) => acc + (curr.readTime || 5), 0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 editorial-card rounded-2xl bg-white dark:bg-navy-800 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-1">
            <Feather className="w-3.5 h-3.5 stroke-[2]" />
            <span>Author Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Published Blogs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Manage your articles, edit content, or review publication metrics
          </p>
        </div>

        <Link
          to="/create-blog"
          className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-900">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPosts}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Articles Published</div>
          </div>
        </div>

        <div className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-900">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalReadTime} mins</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Reading Time</div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Stories ({totalPosts})</h2>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="editorial-card rounded-2xl p-5 h-64 animate-pulse bg-white dark:bg-navy-800" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onDelete={openDeleteModal} />
            ))}
          </div>
        ) : (
          <div className="editorial-card rounded-2xl p-10 text-center max-w-md mx-auto space-y-3 bg-white dark:bg-navy-800 my-6">
            <PenSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">You haven't written any blogs yet</h3>
            <p className="text-xs text-slate-500">
              Publish your first story to see it here on your author dashboard.
            </p>
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create Blog Post</span>
            </Link>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteModal.blogTitle}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
};

export default MyBlogs;
