☆*°★*Aylin*★°*☆
astronomy_movies
Невидимый

ezizroler — 25.05.2025 19:02
ezizroler
 начал звонок, который продлился 12 минут. — 25.05.2025 19:02
☆*°★*Aylin*★°*☆ — 25.05.2025 19:02
ezizroler
 начал звонок, который продлился 13 минут. — 28.05.2025 18:44
ezizroler
 начал звонок, который продлился 22 минуты. — 28.05.2025 23:20
☆*°★*Aylin*★°*☆ — 05.06.2025 13:39
hii
ezizroler — 05.06.2025 13:39
helloo
ezizroler
 начал звонок, который продлился 4 минуты. — 05.06.2025 13:39
ezizroler
 начал звонок, который продлился 2 минуты. — 05.06.2025 13:53
☆*°★*Aylin*★°*☆
 начал звонок, который продлился час. — 20.07.2025 21:52
ezizroler — 30.07.2025 21:22
https://discord.gg/DBCCmuUh
☆*°★*Aylin*★°*☆ — 19.08.2025 23:37
sziz
aziz
servire ac
ve ozunde bir gir baxda biz ne elemisik
ezizroler — 19.08.2025 23:39
Acdim
ezizroler — 19.08.2025 23:39
Gelecem bir gun
☆*°★*Aylin*★°*☆ — 19.08.2025 23:39
ozunde gir iki deqiqelik at least
ezizroler — 19.08.2025 23:39
10-15deq sonra MC acib gelerem
☆*°★*Aylin*★°*☆ — 19.08.2025 23:40
okay  amma gir.
ezizroler — 19.08.2025 23:40
Oke
ezizroler — 08.09.2025 0:12
https://discord.gg/kekzMNfm
☆*°★*Aylin*★°*☆
 начал звонок, который продлился 2 часа. — 28.09.2025 17:00
ezizroler — 28.09.2025 17:03
internationalization
ezizroler — 28.09.2025 18:49
https://intranet.hbtn.io/corrections/1340392/correct
☆*°★*Aylin*★°*☆ — 28.09.2025 18:51
https://intranet.hbtn.io/corrections/1341118/correct
☆*°★*Aylin*★°*☆
 начал звонок, который продлился несколько секунд. — 22.11.2025 20:34
ezizroler
 начал звонок, который продлился минута. — 22.11.2025 20:37
☆*°★*Aylin*★°*☆
 начинает звонок. — 23:14
ezizroler — 23:35
src/context/IdeaContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ideaService } from '../services/ideaService';

const IdeaContext = createContext();

const USE_MOCK_BACKEND = true; 

message.txt
6 кб
src/pages/ResultsDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdea } from '../context/IdeaContext';
import { ArrowLeft, CheckCircle, Info, Download, RefreshCw, Wand2, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

message.txt
11 кб
﻿
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ideaService } from '../services/ideaService';

const IdeaContext = createContext();

const USE_MOCK_BACKEND = true; 

export const IdeaProvider = ({ children }) => {
  const[userIdea, setUserIdea] = useState('');
  const [selectedMode, setSelectedMode] = useState('Entrepreneur');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  },[]);

  const loadHistory = async () => {
    if (USE_MOCK_BACKEND) {
      const savedHistory = localStorage.getItem('forge_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      return;
    }
    try {
      const data = await ideaService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const processIdea = async () => {
    try {
      let finalData;
      if (USE_MOCK_BACKEND) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        finalData = generateMockResults(selectedMode, userIdea);
        
        const newHistoryItem = {
          id: Date.now(),
          title: userIdea.length > 0 ? userIdea.substring(0, 30) + "..." : "New Project",
          mode: selectedMode,
          date: new Date().toLocaleDateString()
        };
        const updatedHistory = [newHistoryItem, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('forge_history', JSON.stringify(updatedHistory));
      } else {
        finalData = await ideaService.generateIdea(selectedMode, userIdea);
        await loadHistory();
      }
      setResults(finalData);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to connect to the backend Forge." };
    }
  };

  // 🌟 NEW FEATURE: Micro-Refinement Logic
  const refineNode = async (sectionId, itemIndex, instruction) => {
    if (USE_MOCK_BACKEND) {
      // Simulate a 1.5s AI API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResults(prev => {
        const newResults = { ...prev };
        const oldText = newResults.content[sectionId][itemIndex];
        // Replace the old text with a "Mock AI" updated version
        newResults.content[sectionId][itemIndex] = `✨ [Optimized for: ${instruction}] ${oldText}`;
        return newResults;
      });
      return { success: true };
    } else {
      // For when your backend is ready:
      // await ideaService.refineSpecificNode(sectionId, itemIndex, instruction);
    }
  };

  const generateMockResults = (mode, idea) => {
    const metrics = {
      score: Math.floor(Math.random() * 12) + 85, 
      timeline: mode === 'Hackathon' ? "48 Hours" : mode === 'Student' ? "4 Weeks" : "6 Months",
      difficulty: mode === 'Hackathon' ? "Very High" : "Moderate",
      marketPotential: "Strong / Emerging",
    };

    const modeConfigs = {
      Student: {
        theme: 'emerald',
        sections:[
          { id: 'tech', label: 'Architecture & Stack', icon: 'Code' },
          { id: 'steps', label: 'Development Syllabus', icon: 'BookOpen' }
        ],
        content: {
          tech:["Frontend: React 18 with Vite.", "Backend: Supabase for Auth.", "Deployment: Vercel Edge Functions."],
          steps: ["Phase 1: Environment orchestration.", "Phase 2: Database schema normalization."]
        }
      },
      Entrepreneur: {
        theme: 'amber',
        sections:[
          { id: 'mvp', label: 'MVP Core Architecture', icon: 'Zap' },
          { id: 'market', label: 'Unit Economics', icon: 'DollarSign' }
        ],
        content: {
          mvp: ["Core Value Prop: Automated workflow engine.", "Tier 1 Features: User Auth, Data Dashboard."],
          market:["Model: Tiered SaaS (Freemium, Pro at $29/mo).", "Target: SMBs in the high-growth tech sector."]
        }
      },
      Hackathon: {
        theme: 'cyan',
        sections:[
          { id: 'pitch', label: 'Winning Pitch Script', icon: 'Mic' },
          { id: 'speed', label: 'Development Hacks', icon: 'FastForward' }
        ],
        content: {
          pitch:["0:00-0:45: The Problem. Use a personal story.", "1:15-2:30: Live Demo. Navigate the core happy path."],
          speed:["UI: Use pre-built components (shadcn/ui).", "Data: Use mock JSON files; don't build a full CRUD."]
        }
      },
      Team: {
        theme: 'purple',
        sections:[
          { id: 'roles', label: 'Workforce Allocation', icon: 'Users' },
          { id: 'sprints', label: 'Agile Roadmap', icon: 'Calendar' }
        ],
        content: {
          roles: ["Frontend Architect: Owner of the Design System.", "Backend Lead: Responsible for API design."],
          sprints:["Sprint 1: Repository initialization.", "Sprint 2: Core feature implementation."]
        }
      }
    };

    const config = modeConfigs[mode] || modeConfigs.Student;

    return { problem: idea || "Conceptual gap identified in the market.", metrics, ...config };
  };

  return (
    <IdeaContext.Provider value={{ 
      userIdea, setUserIdea, selectedMode, setSelectedMode, 
      results, processIdea, history, loadHistory, refineNode 
    }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdea = () => useContext(IdeaContext);
