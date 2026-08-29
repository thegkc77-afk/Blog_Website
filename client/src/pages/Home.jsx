import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import { Search, Sparkles, Filter, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Technology', 'Design', 'Lifestyle', 'Programming', 'Business'];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State for deleting
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: '',
    isDeleting: false,
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await blogAPI.getAll(search, selectedCategory);
      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300); // Debounce search input
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-800 shadow-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Blog Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Share Ideas. Express Thoughts. <br className="hidden sm:inline" />
            <span className="gradient-text">Inspire the World.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Discover technical insights, creative stories, and full-stack perspectives. Read articles published by creators worldwide.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/create-blog"
            className="gradient-btn px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Article</span>
          </Link>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs by title, tags, or content..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            />
          </div>

          {/* Refresh Action */}
          <button
            onClick={fetchBlogs}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
            title="Refresh blogs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Categories:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blogs Grid & Loading / Error States */}
      <section>
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-slate-800 rounded-full"></div>
                  <div className="h-6 w-full bg-slate-800 rounded-lg"></div>
                  <div className="h-4 w-5/6 bg-slate-800/60 rounded"></div>
                  <div className="h-4 w-4/6 bg-slate-800/40 rounded"></div>
                </div>
                <div className="h-4 w-full bg-slate-800/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">No blog posts found</h3>
            <p className="text-sm text-slate-400">
              {search
                ? `No articles matched your search "${search}". Try adjusting your keywords.`
                : 'No blog posts have been published yet. Be the first to write one!'}
            </p>
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write First Post</span>
            </Link>
          </div>
        )}
      </section>

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This operation is permanent and cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
};

export default Home;
