import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Call the auth context (which handles mock vs real backend)
    const result = isLogin 
      ? await login(username, password) 
      : await signup(username, email, password);

    setIsSubmitting(false);

    // If successful, go to the app. If failed, show error.
    if (result.success) {
      navigate('/mode');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          {isLogin ? 'Forge Access' : 'Create Identity'}
        </h2>
        <p className="text-slate-400 text-center mb-8">Enter the IdeaForge ecosystem.</p>
        
        {/* Error Message Box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-900/50 rounded-xl border border-white/5 focus:border-indigo-500 outline-none text-white transition-all"
              placeholder="johndoe"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Email Address</label>
              <input 
                type="email" 
                required={!isLogin}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-900/50 rounded-xl border border-white/5 focus:border-indigo-500 outline-none text-white transition-all"
                placeholder="name@company.com"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-900/50 rounded-xl border border-white/5 focus:border-indigo-500 outline-none text-white transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>}
            {isSubmitting ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            className="text-indigo-400 text-sm hover:text-indigo-300 transition underline underline-offset-4"
          >
            {isLogin ? "New here? Create an account" : "Already a member? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;