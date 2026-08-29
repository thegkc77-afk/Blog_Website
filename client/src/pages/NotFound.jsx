import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 mx-auto flex items-center justify-center text-indigo-400">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-indigo-400 tracking-wider">404</span>
          <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
          <p className="text-sm text-slate-400">
            The page or blog article you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="gradient-btn px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
