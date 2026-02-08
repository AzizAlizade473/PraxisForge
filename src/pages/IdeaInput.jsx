import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, Type, FileUp, Sparkles, StopCircle } from 'lucide-react';
import { useIdea } from '../context/IdeaContext';

const IdeaInput = () => {
  const { userIdea, setUserIdea, selectedMode } = useIdea();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  // VOICE RECOGNITION LOGIC
  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setUserIdea(transcript);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  // FILE UPLOAD LOGIC
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserIdea(e.target.result); // Reads text files
        setActiveTab('text');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6">
        <div className="flex bg-slate-900 p-1 rounded-xl w-fit mb-6">
          <TabBtn active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<Type size={18}/>} label="Text" />
          <TabBtn active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} icon={<Mic size={18}/>} label="Voice" />
          <TabBtn active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<FileUp size={18}/>} label="Upload" />
        </div>

        {activeTab === 'text' && (
          <textarea 
            className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl p-4 text-white" 
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            placeholder="Describe your idea..."
          />
        )}

        {activeTab === 'voice' && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
             <button 
              onClick={handleVoice}
              className={`p-8 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`}
             >
              {isListening ? <StopCircle size={40}/> : <Mic size={40}/>}
             </button>
             <p className="mt-4 text-slate-400">{isListening ? "Listening... Speak now" : "Click to start speaking"}</p>
             <p className="mt-2 text-sm text-indigo-400 italic px-10 text-center">{userIdea}</p>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
            <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md,.doc" />
            <button onClick={() => fileInputRef.current.click()} className="px-6 py-3 bg-slate-800 rounded-lg">Select Document (.txt)</button>
            <p className="mt-2 text-slate-500">Supported: Text, Markdown</p>
          </div>
        )}

        <button 
          onClick={() => navigate('/processing')}
          className="w-full mt-6 py-4 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Sparkles /> Forge My Idea
        </button>
      </div>
    </div>
  );
};

const TabBtn = ({active, onClick, icon, label}) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${active ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
    {icon} {label}
  </button>
);

export default IdeaInput;