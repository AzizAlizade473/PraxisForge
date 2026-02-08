import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo - Clickable to Home */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:rotate-12 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Idea<span className="text-indigo-400">Forge</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Home size={16} /> <span className="hidden sm:inline">Home</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-8">
              {/* Account Link */}
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/profile') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <User size={16} className="text-indigo-400" />
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="text-slate-500 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-indigo-500/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;