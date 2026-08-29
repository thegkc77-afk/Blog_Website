import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { PenSquare, Sparkles, Tag, Layers, FileText, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const CATEGORIES = ['General', 'Technology', 'Design', 'Lifestyle', 'Programming', 'Business'];

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    tags: '',
    summary: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Blog title is required.');
      return;
    }

    if (!formData.content.trim() || formData.content.trim().length < 10) {
      setError('Blog content must be at least 10 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await blogAPI.create(formData);
      if (res.success && res.blog) {
        navigate(`/blogs/${res.blog._id}`);
      } else {
        navigate('/my-blogs');
      }
    } catch (err) {
      setError(err.message || 'Failed to publish blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Drafting Post</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Write New Blog Post
          </h1>
          <p className="text-xs text-slate-400">
            Share your knowledge with readers across the web
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Article Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FileText className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Master modern web development with Node & React"
                required
                maxLength={120}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
              />
            </div>
            <div className="flex justify-end text-[11px] text-slate-500 mt-1">
              {formData.title.length}/120
            </div>
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Layers className="w-5 h-5" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tags (Comma separated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Tag className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. react, nodejs, webdev"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Optional Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Short Summary Excerpt (Optional)
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief 1-2 sentence overview of your article..."
              rows="2"
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Article Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article content here..."
              rows="12"
              required
              className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Supports multi-paragraph formatting</span>
              <span>{formData.content.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-btn px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
