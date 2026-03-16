import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Code2, Building2, Lightbulb } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const modes = [
  {
    id: 'startup',
    label: 'Startup',
    icon: Rocket,
    color: 'text-emerald-400',
    desc: 'Ship a venture-scale SaaS. Focus on MVP, market fit, and fundraising narrative.',
  },
  {
    id: 'hackathon',
    label: 'Hackathon',
    icon: Code2,
    color: 'text-cyan-400',
    desc: 'Win the weekend. Optimize for speed, wow-factor, and live demo reliability.',
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    icon: Building2,
    color: 'text-purple-400',
    desc: 'Design for teams and scale. Emphasize security, integrations, and governance.',
  },
  {
    id: 'idea',
    label: 'Idea Lab',
    icon: Lightbulb,
    color: 'text-yellow-400',
    desc: 'Explore and validate raw concepts before committing to a full build.',
  },
];

const ModeSelection = () => {
  const { setSelectedMode } = useProject();
  const navigate = useNavigate();

  const handleSelect = (modeId) => {
    setSelectedMode(modeId);
    navigate('/input');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-slate-400">How should the AI analyze your idea?</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full"
      >
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            onClick={() => handleSelect(mode.id)}
            className="glass-card p-8 rounded-2xl cursor-pointer group hover:bg-white/10 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`p-3 w-fit rounded-lg bg-slate-900/50 ${mode.color}`}>
                <mode.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold">{mode.label} Mode</h3>
              <p className="text-slate-400 group-hover:text-slate-200 transition-colors">
                {mode.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ModeSelection;