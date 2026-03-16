import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Cpu, Database, Sparkles, Binary } from 'lucide-react';

const AIProcessing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveProjectId } = useProject();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "Initializing Forge Core...", icon: <Cpu className="text-indigo-400" /> },
    { text: "Mapping Neural Pathways...", icon: <Binary className="text-cyan-400" /> },
    { text: "Analyzing Market Saturation...", icon: <Database className="text-purple-400" /> },
    { text: "Forging Execution Roadmap...", icon: <Sparkles className="text-amber-400" /> }
  ];

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      navigate('/');
      return;
    }

    setActiveProjectId(projectId);

    const timeout = setTimeout(() => {
      navigate(`/results?projectId=${encodeURIComponent(projectId)}`);
    }, 4000);

    // Cycle through the text steps visually
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [navigate, searchParams, setActiveProjectId]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      {/* Animated Rings */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border-2 border-indigo-500/40 border-t-transparent rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]"
        >
          <div className="text-indigo-400">
            {steps[currentStep].icon}
          </div>
        </motion.div>
      </div>

      {/* Progress Text */}
      <div className="mt-12 text-center h-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xl font-mono tracking-widest text-white uppercase">
              {steps[currentStep].text}
            </span>
            <span className="text-indigo-500 text-sm font-bold">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Loading Bar */}
      <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
        />
      </div>
    </div>
  );
};

export default AIProcessing;