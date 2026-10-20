import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
        <Wrench className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-neutral-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-neutral-800">Page Not Found</h2>
      <p className="text-xs text-neutral-500">
        The home service page or booking link you are looking for does not exist or has been relocated.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors"
        >
          Browse Services
        </Link>
      </div>
    </div>
  );
}
