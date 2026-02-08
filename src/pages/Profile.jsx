import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Clock, BookMarked, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  
  const history = [
    { id: 1, title: "SaaS for Architects", mode: "Entrepreneur", status: "Completed" },
    { id: 2, title: "University Library App", mode: "Student", status: "Draft" },
  ];

  return (
    <div className="min-h-screen pt-28 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Card: User Info */}
        <div className="w-full md:w-80 glass-panel p-8 rounded-3xl border border-white/10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.name[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-slate-400 text-sm mb-6">{user?.email}</p>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-6">Member since {user?.joined}</div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18}/> Sign Out
          </button>
        </div>

        {/* Right Card: History */}
        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-indigo-400" /> Project History
          </h2>
          <div className="grid gap-4">
            {history.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ x: 10 }}
                className="glass-card p-5 rounded-2xl flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition">{project.title}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">{project.mode}</span>
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400">{project.status}</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white transition" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;