import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, BookOpen, PenSquare, LogOut, Feather, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-8">
        
        {/* Profile Card Top */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left border-b border-slate-200/80 dark:border-slate-800 pb-8">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-extrabold text-3xl flex items-center justify-center border border-brand-200 dark:border-brand-700 shadow-sm flex-shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active Author Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="editorial-card rounded-xl bg-slate-50/50 dark:bg-navy-900/50 p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Member Since</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate(user.createdAt)}</p>
          </div>

          <div className="editorial-card rounded-xl bg-slate-50/50 dark:bg-navy-900/50 p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Feather className="w-4 h-4 text-brand-600" />
              <span>Author Bio</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">{user.bio || 'Writer, developer, and story enthusiast.'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/my-blogs"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-navy-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Published Posts</span>
            </Link>

            <Link
              to="/create-blog"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Post</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
