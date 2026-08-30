import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="editorial-card rounded-2xl bg-white dark:bg-navy-800 p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-card max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-100 dark:border-brand-900 mx-auto flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-brand-600 dark:text-brand-400 tracking-wider">404</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The page or blog article you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
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
