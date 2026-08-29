import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import { LayoutDashboard, PenSquare, FileText, Clock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

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

  // Compute metrics
  const totalPosts = blogs.length;
  const totalReadTime = blogs.reduce((acc, curr) => acc + (curr.readTime || 1), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Author Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Published Blogs
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your articles, edit content, or review performance
          </p>
        </div>

        <Link
          to="/create-blog"
          className="gradient-btn px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg whitespace-nowrap"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalPosts}</div>
            <div className="text-xs font-medium text-slate-400">Total Published Articles</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalReadTime} mins</div>
            <div className="text-xs font-medium text-slate-400">Total Estimated Read Time</div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Your Posts ({totalPosts})</h2>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onDelete={openDeleteModal} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4 my-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <PenSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">You haven't written any blogs yet</h3>
            <p className="text-xs text-slate-400">
              Publish your first blog article to display it in your personal dashboard.
            </p>
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-xs font-semibold"
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
