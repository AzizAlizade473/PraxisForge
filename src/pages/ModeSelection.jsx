import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Rocket, Code2, Users } from 'lucide-react';
import { useIdea } from '../context/IdeaContext';

const modes = [
  { 
    id: 'Student', 
    icon: GraduationCap, 
    color: 'text-yellow-400', 
    desc: 'Structure projects for grades. Focus on tech stack & documentation.' 
  },
  { 
    id: 'Entrepreneur', 
    icon: Rocket, 
    color: 'text-emerald-400', 
    desc: 'Validate business viability. Focus on MVP features & market fit.' 
  },
  { 
    id: 'Hackathon', 
    icon: Code2, 
    color: 'text-cyan-400', 
    desc: 'Speed to demo. Focus on impact, complexity, and pitch.' 
  },
  { 
    id: 'Team', 
    icon: Users, 
    color: 'text-purple-400', 
    desc: 'Divide and conquer. Focus on role allocation & tasks.' 
  },
];

const ModeSelection = () => {
  const { setSelectedMode } = useIdea();
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
              <h3 className="text-2xl font-bold">{mode.id} Mode</h3>
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