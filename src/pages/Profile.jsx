import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Clock, Settings, Sparkles, 
  Trash2, ExternalLink, Zap, BrainCircuit, Target 
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { /* future: project history */ } = useProject();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('history');
  
  // Local state for UI deletion (so you don't have to rewrite context right now)
  const [localHistory, setLocalHistory] = useState(history ||[]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDelete = (id) => {
    setLocalHistory(prev => prev.filter(item => item.id !== id));
    // In a real app, you would also update Context/LocalStorage here
  };

  // Dynamic Theme Mapper for Badges
  const getTheme = (mode) => {
    switch (mode) {
      case 'Student': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Entrepreneur': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hackathon': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Team': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="min-h-screen pt-28 px-4 md:px-10 max-w-7xl mx-auto text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: USER IDENTITY ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-[32px] border border-white/10 relative overflow-hidden">
            {/* Decorative Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-[60px]" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl p-1 shadow-xl shadow-indigo-500/20 mb-6 group">
                <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-cyan-400 transition-transform group-hover:scale-105">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-1">{user?.name || 'Visionary Creator'}</h1>
              <p className="text-slate-400 text-sm mb-4">{user?.email || 'user@ideaforge.ai'}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-8">
                <Sparkles size={12} className="text-indigo-400" />
                Pro Architect
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <LogOut size={16}/> End Session
              </button>
            </div>
          </div>

          {/* Gamified Statistics Board */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-3xl border border-white/10">
              <BrainCircuit className="text-cyan-400 mb-3" size={24} />
              <div className="text-2xl font-bold text-white">{localHistory.length}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Ideas Forged</div>
            </div>
            <div className="glass-panel p-5 rounded-3xl border border-white/10">
              <Zap className="text-amber-400 mb-3" size={24} />
              <div className="text-2xl font-bold text-white">{localHistory.length * 14}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Hours Saved</div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE DASHBOARD ================= */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="glass-panel rounded-[32px] border border-white/10 min-h-[600px] flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-white/[0.02]">
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-indigo-600/10 border-t-2 border-t-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300 border-t-2 border-t-transparent'}`}
              >
                <Clock size={16} /> Forge History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-indigo-600/10 border-t-2 border-t-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300 border-t-2 border-t-transparent'}`}
              >
                <Settings size={16} /> Account Preferences
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-10 flex-1">
              {activeTab === 'history' && (
                <div className="h-full">
                  {localHistory.length === 0 ? (
                    // BEAUTIFUL EMPTY STATE
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-80 mt-10">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                        <Target size={32} className="text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">The Canvas is Blank</h3>
                      <p className="text-slate-400 max-w-sm mx-auto mb-8">
                        You haven't forged any ideas yet. Head over to the console and turn your first raw concept into a structured plan.
                      </p>
                      <button 
                        onClick={() => navigate('/mode')}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                      >
                        <Sparkles size={18} /> Start Forging
                      </button>
                    </div>
                  ) : (
                    // INTERACTIVE LIST
                    <div className="space-y-4">
                      <AnimatePresence>
                        {localHistory.map((item, idx) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                            transition={{ delay: idx * 0.05 }}
                            key={item.id}
                            className="group p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border ${getTheme(item.mode)}`}>
                                  {item.mode}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock size={12} /> {item.date}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => navigate('/results')} // Mocks going back to the result
                                className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                                title="View Details"
                              >
                                <ExternalLink size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                   <h3 className="text-xl font-bold border-b border-white/5 pb-4">Account Preferences</h3>
                   <div className="space-y-4 text-slate-400 text-sm">
                      <p>• API Connection: <span className="text-emerald-400">Stable</span></p>
                      <p>• AI Model: GPT-4 Turbo (Mock)</p>
                      <p>• Data Export Format: JSON / PDF</p>
                   </div>
                   <div className="mt-8 p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                      <h4 className="font-bold text-white mb-2">Connect Integrations</h4>
                      <p className="text-slate-400 text-sm mb-4">Link your IdeaForge account to external tools.</p>
                      <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm flex items-center gap-2">
                        Connect Notion Workspace
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;