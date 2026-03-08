import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdea } from '../context/IdeaContext';
import { ArrowLeft, CheckCircle, Info, Download, RefreshCw, Wand2, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResultsDashboard = () => {
  const { results, selectedMode, refineNode } = useIdea();
  const navigate = useNavigate();
  const[activeSection, setActiveSection] = useState(0);

  // Feature 1 State: Micro-Refinement
  const [refiningTarget, setRefiningTarget] = useState({ sectionId: null, index: null });
  const [refinePrompt, setRefinePrompt] = useState("");
  const[isRefining, setIsRefining] = useState(false);

  // Feature 2 State: Notion Sync Theatre
  const[syncState, setSyncState] = useState('idle'); // idle | syncing | done

  if (!results) return <div className="pt-32 text-center text-white">No data. <button onClick={() => navigate('/')}>Back</button></div>;

  const currentSectionId = results.sections[activeSection].id;

  // Sync to Notion Animation Logic
  const handleNotionSync = () => {
    if (syncState !== 'idle') return;
    setSyncState('syncing');
    setTimeout(() => setSyncState('done'), 2500);
    setTimeout(() => setSyncState('idle'), 5000);
  };

  // Submit Refinement to Context
  const handleRefineSubmit = async (e) => {
    e.preventDefault();
    if (!refinePrompt.trim()) return;
    
    setIsRefining(true);
    await refineNode(currentSectionId, refiningTarget.index, refinePrompt);
    
    setIsRefining(false);
    setRefiningTarget({ sectionId: null, index: null });
    setRefinePrompt("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-10 px-4 md:px-10">
      
      {/* Top Navigation & ACTION CENTER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <button onClick={() => navigate('/input')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} /> New Forge
        </button>
        
        {/* 🌟 FEATURE 2: Export & Sync Ecosystem */}
        <div className="flex items-center gap-3">
           <span className="px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 text-sm font-mono">
             {selectedMode} Mode
           </span>
           
           <button 
             onClick={() => window.print()} 
             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white hover:bg-slate-800 transition text-sm"
           >
             <Download size={16} /> Export PDF
           </button>

           <button 
             onClick={handleNotionSync}
             disabled={syncState !== 'idle'}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
               syncState === 'idle' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' :
               syncState === 'syncing' ? 'bg-indigo-500/50 text-indigo-100 cursor-not-allowed' :
               'bg-emerald-500 text-white shadow-emerald-500/20'
             }`}
           >
             {syncState === 'idle' && <><RefreshCw size={16} /> Sync to Notion</>}
             {syncState === 'syncing' && <><Loader2 size={16} className="animate-spin" /> Authenticating Workspace...</>}
             {syncState === 'done' && <><CheckCircle size={16} /> Successfully Synced</>}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Summary Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <h1 className="text-2xl font-bold mb-6">Forge Analytics</h1>
            <div className="space-y-6">
              <Metric label="Success Score" value={`${results.metrics.score}%`} color="text-emerald-400" />
              <Metric label="Estimated Timeline" value={results.metrics.timeline} color="text-cyan-400" />
              <Metric label="Complexity" value={results.metrics.difficulty} color="text-amber-400" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-indigo-600/5">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Info size={18} />
              <span className="font-bold text-sm uppercase tracking-widest">Target Context</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/30 pl-3">
              "{results.problem}"
            </p>
          </div>
        </div>

        {/* Right Panel: The Interactive AI Nodes */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-3xl border border-white/10 min-h-[600px] flex flex-col overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex border-b border-white/5 bg-slate-900/50">
              {results.sections.map((sec, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSection(i); setRefiningTarget({ sectionId: null, index: null }); }}
                  className={`flex-1 py-5 text-sm font-bold transition-all ${activeSection === i ? 'bg-indigo-600 border-t-2 border-t-indigo-400 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300 border-t-2 border-t-transparent'}`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-10 flex-1">
              <div className="space-y-4">
                {results.content[currentSectionId].map((item, idx) => {
                  const isBeingRefined = refiningTarget.sectionId === currentSectionId && refiningTarget.index === idx;

                  return (
                    <div key={idx} className="relative group">
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className={`p-6 rounded-2xl border transition-all ${
                          isBeingRefined ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <CheckCircle className="text-indigo-500 mt-1 shrink-0" size={20} />
                          <span className={`text-lg transition-colors ${item.includes('✨') ? 'text-indigo-200' : 'text-slate-200'}`}>
                            {item}
                          </span>
                        </div>

                        {/* 🌟 FEATURE 1: Micro-Refinement Hover Button */}
                        {!isBeingRefined && (
                          <button 
                            onClick={() => setRefiningTarget({ sectionId: currentSectionId, index: idx })}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                          >
                            <Wand2 size={14} /> Refine with AI
                          </button>
                        )}

                        {/* Refinement Input Dropdown */}
                        <AnimatePresence>
                          {isBeingRefined && (
                            <motion.form 
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              onSubmit={handleRefineSubmit}
                              className="mt-6 pt-6 border-t border-indigo-500/20"
                            >
                              <div className="flex gap-3">
                                <input 
                                  autoFocus
                                  type="text" 
                                  placeholder="E.g., Make this cheaper, Target a different demographic..." 
                                  value={refinePrompt}
                                  onChange={(e) => setRefinePrompt(e.target.value)}
                                  className="flex-1 bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-400 transition"
                                />
                                <button 
                                  disabled={isRefining}
                                  type="submit"
                                  className="px-6 bg-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50 transition"
                                >
                                  {isRefining ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                  Update
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setRefiningTarget({ sectionId: null, index: null })}
                                  className="px-4 text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, color }) => (
  <div className="border-b border-white/5 pb-4 last:border-0">
    <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
    <div className={`text-3xl font-bold mt-1 ${color}`}>{value}</div>
  </div>
);

export default ResultsDashboard;
