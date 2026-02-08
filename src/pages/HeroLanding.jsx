import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const HeroLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-cyan-300 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>v2.0 Now Live: Enhanced AI Models</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-white leading-tight">
          Turn Raw Ideas into <br />
          <span className="gradient-text">Executable Success</span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The first AI architect that doesn't just chat—it structures, validates, and plans your next big project. Tailored for students, founders, and hackers.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/mode')}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 opacity-30 blur-lg transition-all duration-200 group-hover:opacity-70" />
          <span className="relative flex items-center gap-2">
            Start Forging <ArrowRight className="w-5 h-5" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HeroLanding;