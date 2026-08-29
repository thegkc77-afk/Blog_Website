import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-slate-300">
            DevVibe Blog
          </span>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using MERN Stack (React, Express, MongoDB, Node.js)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
