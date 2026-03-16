import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ListChecks, Loader2 } from 'lucide-react';
import { praxisService } from '../services/praxisService';

/* ── Stagger container variant ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

/* ── Individual node variant (slide in from right + fade) ──────── */
const nodeVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

/* ── Single timeline node ───────────────────────────────────────── */
const RoadmapNode = ({ step, isCompleted, isLast }) => {
  const dotColor = isCompleted
    ? 'bg-emerald-500 shadow-emerald-500/50'
    : 'bg-slate-600 shadow-slate-600/30';

  const borderGlow = isCompleted
    ? 'hover:border-emerald-500/40 hover:shadow-emerald-500/10'
    : 'hover:border-indigo-500/40 hover:shadow-indigo-500/10';

  return (
    <motion.div variants={nodeVariants} className="flex gap-6 relative">
      {/* ── Timeline spine ─────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        {/* Glowing dot */}
        <motion.div
          className={`relative z-10 w-5 h-5 rounded-full border-2 shrink-0 ${dotColor} ${
            isCompleted ? 'border-emerald-400' : 'border-slate-500'
          }`}
          style={{ boxShadow: isCompleted ? '0 0 14px rgba(16,185,129,0.5)' : '0 0 8px rgba(100,116,139,0.3)' }}
          whileHover={{ scale: 1.4 }}
        />
        {/* Connecting line */}
        {!isLast && (
          <div className="w-0.5 flex-1 min-h-[40px] bg-gradient-to-b from-emerald-500/40 via-indigo-500/20 to-slate-700/20" />
        )}
      </div>

      {/* ── Card ────────────────────────────────────────────────── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`flex-1 mb-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md
                    p-6 shadow-xl transition-all duration-300 ${borderGlow}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            {isCompleted ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <Circle size={18} className="text-slate-500" />
            )}
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                           bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            <Clock size={12} />
            {step.duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{step.description}</p>

        {/* Key tasks checklist */}
        {step.key_tasks && step.key_tasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              <ListChecks size={14} />
              Key Tasks
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {step.key_tasks.map((task, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isCompleted ? 'bg-emerald-400' : 'bg-slate-600'
                  }`} />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ── Main AnimatedRoadmap component ─────────────────────────────── */
const AnimatedRoadmap = ({ projectId }) => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    praxisService
      .getRoadmap(projectId)
      .then((data) => {
        setSteps(Array.isArray(data) ? data : []);
      })
      .catch(() => setSteps([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <span className="ml-3 text-slate-400 text-sm">Loading roadmap…</span>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No roadmap data available for this project yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative gradient glow behind the timeline */}
      <div className="absolute left-[9px] top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/60 via-indigo-500/30 to-transparent pointer-events-none" />

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {steps.map((step, idx) => (
            <RoadmapNode
              key={step.step ?? idx}
              step={step}
              isCompleted={idx === 0} /* first phase is "current / completed" */
              isLast={idx === steps.length - 1}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedRoadmap;
