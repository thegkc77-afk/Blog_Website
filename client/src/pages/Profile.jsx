import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Sparkles, BookOpen, PenSquare, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
        {/* Glow Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Profile Card Top */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left border-b border-slate-800/80 pb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl shadow-indigo-500/30 flex-shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Author Account</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
            <p className="text-sm text-indigo-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Member Since</span>
            </div>
            <p className="text-base font-bold text-slate-200">{formatDate(user.createdAt)}</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Author Bio</span>
            </div>
            <p className="text-sm text-slate-300 italic">{user.bio || 'Blog enthusiast & developer.'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/my-blogs"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Published Posts</span>
            </Link>

            <Link
              to="/create-blog"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-btn text-xs font-semibold"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Post</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
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
