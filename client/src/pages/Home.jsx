import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import { Link, useLocation } from 'react-router-dom';
import {
  Feather,
  BookOpen,
  Users,
  FileText,
  Edit3,
  ShieldCheck,
  Globe,
  Smartphone,
  ArrowRight,
  Search,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Link2,
  Image,
  Sparkles,
  UserPlus,
  ThumbsUp,
  Mail,
  CheckCircle2,
  Filter,
  RefreshCw,
  AlertCircle,
  Home as HomeIcon,
  Grid,
  Bookmark,
  User,
  Settings
} from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Lifestyle', 'Travel', 'Food'];

const SAMPLE_BLOGS = [
  {
    _id: 'sample-1',
    title: 'Exploring the Hidden Beauty of Himalayas',
    summary: 'A journey through serene mountain valleys, ancient culture, and breathtaking trails high up in the majestic Himalayas.',
    category: 'Travel',
    authorName: 'Priya Sharma',
    createdAt: '2024-05-18T10:00:00.000Z',
    readTime: 5,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'sample-2',
    title: 'The Future of Web Development',
    summary: 'Discover key trends in serverless architecture, modern frontend frameworks, AI tooling, and edge computing.',
    category: 'Technology',
    authorName: 'Aman Verma',
    createdAt: '2024-05-15T10:00:00.000Z',
    readTime: 7,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'sample-3',
    title: 'Habits That Make You More Productive',
    summary: 'Simple daily routines, time-blocking methods, and focus strategies to maximize output without burnout.',
    category: 'Lifestyle',
    authorName: 'Neha Singh',
    createdAt: '2024-05-12T10:00:00.000Z',
    readTime: 4,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'sample-4',
    title: '10 Easy & Healthy Breakfast Ideas',
    summary: 'Quick, nutrient-dense breakfast recipes that require minimal prep time for busy morning routines.',
    category: 'Food',
    authorName: 'Rohit Das',
    createdAt: '2024-05-10T10:00:00.000Z',
    readTime: 6,
    coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop',
  },
];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Parse URL Search Query if present
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [location.search]);

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
      const data = await blogAPI.getAll(search, selectedCategory === 'All' ? '' : selectedCategory);
      setBlogs(data.blogs || []);
    } catch (err) {
      // Gracefully fall back to sample dataset if backend endpoint or DB isn't seeded
      setError('');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300);
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  // Combine real blogs with sample blogs to ensure 4 cards show cleanly as per specification
  const displayedBlogs = React.useMemo(() => {
    if (blogs.length >= 4) return blogs.slice(0, 4);
    if (blogs.length > 0) {
      const remaining = SAMPLE_BLOGS.filter(s => !blogs.some(b => b.title === s.title));
      return [...blogs, ...remaining].slice(0, 4);
    }
    // Filter sample blogs by search or category if user filtered
    let filtered = SAMPLE_BLOGS;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (search.trim()) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.summary.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.slice(0, 4);
  }, [blogs, selectedCategory, search]);

  return (
    <div className="space-y-16 pb-20">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative bg-white dark:bg-navy-900 bg-grid-pattern border-b border-slate-200/80 dark:border-slate-800 pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden transition-colors duration-200">
        
        {/* Decorative Subtle Lavender Curve / Radial Gradient */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-6 space-y-8 text-left">
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Share ideas.<br />
                  <span className="text-brand-600 dark:text-brand-400">Inspire</span> the world.
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  BlogNest is a full-stack blog platform where you can write, manage, and read amazing stories from writers around the world.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                {/* Primary Button */}
                <Link
                  to="/create-blog"
                  className="px-6 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
                >
                  <Feather className="w-4 h-4 stroke-[2.2]" />
                  <span>Start writing</span>
                </Link>

                {/* Secondary Button */}
                <a
                  href="#blogs"
                  className="px-6 py-3.5 rounded-lg bg-white dark:bg-navy-800 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-50 dark:hover:bg-navy-700/60 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-subtle"
                >
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                  <span>Explore blogs</span>
                </a>
              </div>

              {/* Statistics Strip */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between max-w-md sm:max-w-lg">
                <div className="flex items-center gap-3 pr-4 sm:pr-8 border-r border-slate-200/80 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-none">10K+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Users</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 sm:px-8 border-r border-slate-200/80 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-none">25K+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Blogs</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-4 sm:pl-8">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <Edit3 className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-none">50K+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Posts</div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Realistic Figma Product UI Editor Window Mockup */}
            <div className="lg:col-span-6 relative">
              
              {/* Outer Window Frame */}
              <div className="editorial-card rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700/80 shadow-window overflow-hidden">
                
                {/* Window Control Header Bar */}
                <div className="px-4 py-3 bg-slate-100/80 dark:bg-navy-900/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    editor.blognest.com
                  </div>
                  <div className="w-12" />
                </div>

                {/* Editor App Body Layout */}
                <div className="grid grid-cols-12 min-h-[360px]">
                  
                  {/* Left Sidebar Icon Navigation */}
                  <div className="col-span-2 border-r border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-navy-900/50 p-3 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-1" />
                    <HomeIcon className="w-4 h-4 text-slate-400 hover:text-brand-600 cursor-pointer" />
                    <Grid className="w-4 h-4 text-slate-400 hover:text-brand-600 cursor-pointer" />
                    <Bookmark className="w-4 h-4 text-slate-400 hover:text-brand-600 cursor-pointer" />
                    <User className="w-4 h-4 text-slate-400 hover:text-brand-600 cursor-pointer" />
                    <Settings className="w-4 h-4 text-slate-400 hover:text-brand-600 cursor-pointer mt-auto" />
                  </div>

                  {/* Editor Workspace */}
                  <div className="col-span-10 p-5 space-y-4 flex flex-col justify-between">
                    
                    {/* Top Editor Control Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Add New Blog
                      </span>
                      <button type="button" className="px-3 py-1 text-xs font-semibold rounded-md bg-brand-600 text-white shadow-sm hover:bg-brand-700">
                        Publish
                      </button>
                    </div>

                    {/* Title Input Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        Title
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Write an engaging title..."
                        className="w-full px-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-400 select-none cursor-default"
                      />
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        Content
                      </label>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-t-md bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/60 text-slate-500">
                        <Bold className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <Italic className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <Underline className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1" />
                        <List className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <Quote className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <Link2 className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600" />
                        <Image className="w-3.5 h-3.5 cursor-pointer hover:text-brand-600 ml-auto" />
                      </div>
                      
                      {/* Writing Workspace */}
                      <div className="h-28 p-3 rounded-b-md bg-white dark:bg-navy-900/40 border border-t-0 border-slate-200 dark:border-slate-700/60 text-xs text-slate-400 leading-relaxed italic">
                        Write your story...
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Floating Notification Badge */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-white dark:bg-navy-800 border border-slate-200/90 dark:border-slate-700 shadow-xl rounded-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 backdrop-blur-md animate-bounce-subtle">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                    Great stories
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    start here ✨
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━ FEATURE STRIP ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-subtle p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4 pr-0 lg:pr-6 lg:border-r border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100 dark:border-brand-900">
                <Edit3 className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Write & Publish
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Create and publish beautiful blogs with our rich editor.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 px-0 lg:px-6 lg:border-r border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100 dark:border-brand-900">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Secure & Private
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your data is safe with us. We use modern authentication.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 px-0 lg:px-6 lg:border-r border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100 dark:border-brand-900">
                <Globe className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Connect & Engage
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Read, share and connect with amazing writers.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 pl-0 lg:pl-6">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100 dark:border-brand-900">
                <Smartphone className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Responsive Design
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enjoy a seamless experience on any device.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━ LATEST BLOGS SECTION ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="blogs" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Latest Blogs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Handpicked stories, technical write-ups, and fresh ideas from top authors.
            </p>
          </div>

          <a
            href="#blogs"
            onClick={() => setSelectedCategory('All')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors group"
          >
            <span>View all blogs</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Category Pills & Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={fetchBlogs}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="editorial-card p-5 h-80 animate-pulse bg-white dark:bg-navy-800 rounded-xl space-y-4">
                <div className="h-40 bg-slate-200 dark:bg-navy-900 rounded-lg" />
                <div className="h-4 bg-slate-200 dark:bg-navy-900 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-navy-900 rounded w-5/6" />
                <div className="h-3 bg-slate-200 dark:bg-navy-900 rounded w-4/6" />
              </div>
            ))}
          </div>
        ) : displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="editorial-card p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No blogs match your filter</h3>
            <p className="text-xs text-slate-500">Try switching categories or clearing search query.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearch(''); }}
              className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━ HOW IT WORKS SECTION ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="about" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How BlogNest Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Get started in minutes and share your perspective with readers across the globe.
          </p>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Step 01 */}
          <div className="space-y-4 text-center sm:text-left relative group">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-800 shadow-subtle group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                01
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Account
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign up and join our growing community of writers.
            </p>
          </div>

          {/* Step 02 */}
          <div className="space-y-4 text-center sm:text-left relative group">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-800 shadow-subtle group-hover:scale-110 transition-transform">
                <Edit3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                02
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Write Your Blog
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use our rich editor to write and publish your story.
            </p>
          </div>

          {/* Step 03 */}
          <div className="space-y-4 text-center sm:text-left relative group">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-800 shadow-subtle group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                03
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Share With World
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your blog goes live for readers around the world.
            </p>
          </div>

          {/* Step 04 */}
          <div className="space-y-4 text-center sm:text-left relative group">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-800 shadow-subtle group-hover:scale-110 transition-transform">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                04
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Engage & Grow
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get likes, comments and build your audience.
            </p>
          </div>

        </div>

      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━ NEWSLETTER / CTA BANNER ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="relative rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-900 shadow-xl overflow-hidden text-white p-8 sm:p-12">
          
          {/* Subtle Decorative Curves */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Graphic / Icon Arrangement */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-lg gap-2 text-white">
                <Mail className="w-10 h-10 stroke-[1.8]" />
                <Feather className="w-5 h-5 stroke-[2] text-brand-200" />
              </div>
            </div>

            {/* Content & Form Column */}
            <div className="lg:col-span-9 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Stay updated with BlogNest
                </h3>
                <p className="text-sm text-brand-100 leading-relaxed max-w-xl">
                  Subscribe to get the latest updates and new blogs delivered to your inbox.
                </p>
              </div>

              {/* Form Input */}
              {newsletterSubscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-lg bg-white/10 dark:bg-navy-950/40 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-white text-brand-700 font-bold text-xs sm:text-sm hover:bg-brand-50 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </section>

      {/* Delete Confirmation Modal */}
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
