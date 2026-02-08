import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIdea } from '../context/IdeaContext';
import * as LucideIcons from 'lucide-react';

const ResultsDashboard = () => {
  const { results, selectedMode } = useIdea();
  const [activeTab, setActiveTab] = useState(results?.sections[0].id);

  if (!results) return null;

  // Dynamic Styles Mapping
  const themeMap = {
    emerald: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/20",
    cyan: "from-cyan-400 to-blue-500 shadow-cyan-500/20",
    purple: "from-purple-400 to-pink-500 shadow-purple-500/20",
  };

  const IconComponent = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
    return <Icon size={20} />;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Header with Unique Branding per Mode */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Forge <span className={`bg-gradient-to-r ${themeMap[results.theme]} bg-clip-text text-transparent`}>Results</span>
          </h1>
          <p className="text-slate-400 mt-1">Mode: <span className="capitalize">{selectedMode}</span> Strategy</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <span className="text-xs text-slate-500 block">Feasibility</span>
              <span className={`font-bold ${results.theme === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>{results.score}%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs - Unique Colors per Mode */}
        <div className="lg:col-span-3 space-y-4">
          {results.sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                activeTab === sec.id 
                ? `bg-gradient-to-r ${themeMap[results.theme]} border-transparent text-slate-950 font-bold scale-[1.02] shadow-xl` 
                : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {IconComponent(sec.icon)}
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content Area - Changing Layout based on Mode */}
        <div className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel rounded-[32px] p-8 md:p-12 border-t-4 ${
              selectedMode === 'Hackathon' ? 'border-t-cyan-400' : 
              selectedMode === 'Entrepreneur' ? 'border-t-amber-400' :
              selectedMode === 'Student' ? 'border-t-emerald-400' : 'border-t-purple-400'
            }`}
          >
            {/* Unique Problem Section (Top Bar) */}
            <div className="mb-10 pb-10 border-b border-white/5">
                <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">The Input Concept</h3>
                <p className="text-2xl text-slate-200 italic font-medium leading-relaxed">
                  "{results.problem}"
                </p>
            </div>

            {/* Main Content Display */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                 <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${themeMap[results.theme]}`} />
                 {results.sections.find(s => s.id === activeTab)?.label}
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed whitespace-pre-wrap">
                {results.content[activeTab]}
              </p>
            </div>

            {/* Special "Mode-Specific" Callout */}
            <div className={`mt-12 p-6 rounded-2xl border ${results.theme === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-white/5 border-white/10'}`}>
               <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Pro Tip for {selectedMode}s</p>
               <p className="text-slate-300 italic">
                  {selectedMode === 'Hackathon' && "Speed beats perfection. If it works once during the demo, ship it."}
                  {selectedMode === 'Entrepreneur' && "Focus on the unit economics. AI is expensive; prove the margin early."}
                  {selectedMode === 'Student' && "Don't just show the result. Explain the 'Why' behind your choice of technology."}
                  {selectedMode === 'Team' && "The biggest risk is communication. Sync the codebase every 4 hours."}
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;