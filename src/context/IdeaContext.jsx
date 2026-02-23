import React, { createContext, useContext, useState, useEffect } from 'react';
import { ideaService } from '../services/ideaService';

const IdeaContext = createContext();

// ==========================================
// 🚀 DEVELOPMENT TOGGLE
// Set this to `false` when your backend team is ready!
// ==========================================
const USE_MOCK_BACKEND = true; 

export const IdeaProvider = ({ children }) => {
  const [userIdea, setUserIdea] = useState('');
  const [selectedMode, setSelectedMode] = useState('Entrepreneur');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history on initial app load
  useEffect(() => {
    loadHistory();
  }, []);

  // --------------------------------------------------------
  // 1. API CONNECTION: FETCH HISTORY
  // --------------------------------------------------------
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
      console.error("Failed to fetch history from API:", error);
    }
  };

  // --------------------------------------------------------
  // 2. API CONNECTION: GENERATE NEW IDEA
  // --------------------------------------------------------
  const processIdea = async () => {
    try {
      let finalData;

      if (USE_MOCK_BACKEND) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        finalData = generateMockResults(selectedMode, userIdea);
        
        // Save local mock history
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
        // ACTUAL API CALL to your Backend
        finalData = await ideaService.generateIdea(selectedMode, userIdea);
        
        // Refresh history from backend after new project is created
        await loadHistory();
      }

      setResults(finalData);
      return { success: true };

    } catch (error) {
      console.error("API Error generating idea:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to connect to the backend Forge." 
      };
    }
  };

  // --------------------------------------------------------
  // 3. MOCK DATA ENGINE (Fallback while backend is building)
  // Your backend MUST return exactly this JSON structure!
  // --------------------------------------------------------
  const generateMockResults = (mode, idea) => {
    const metrics = {
      score: Math.floor(Math.random() * 12) + 85, 
      timeline: mode === 'Hackathon' ? "48-72 Hours" : mode === 'Student' ? "4-6 Weeks" : "6-8 Months",
      difficulty: mode === 'Hackathon' ? "Very High" : "Moderate",
      marketPotential: "Strong / Emerging",
    };

    const modeConfigs = {
      Student: {
        theme: 'emerald',
        sections: [
          { id: 'tech', label: 'Architecture & Stack', icon: 'Code' },
          { id: 'steps', label: 'Development Syllabus', icon: 'BookOpen' },
          { id: 'academic', label: 'Evaluation Strategy', icon: 'FileText' }
        ],
        content: {
          tech: [
            "Frontend: React 18 with Vite for optimized Hot Module Replacement (HMR).",
            "Styling: Tailwind CSS utilizing a utility-first approach.",
            "Backend: Supabase for PostgreSQL database management and Auth.",
            "Deployment: Vercel Edge Functions for low-latency global delivery."
          ],
          steps: [
            "Phase 1: Environment orchestration and atomic component design.",
            "Phase 2: Database schema normalization and Row Level Security (RLS).",
            "Phase 3: Integration of asynchronous API calls and React hooks.",
            "Phase 4: Finalizing technical documentation and deployment pipelines."
          ],
          academic: [
            "Documentation Focus: Deep dive into the Component Lifecycle diagrams.",
            "Logic Highlight: Emphasize the separation of concerns between UI and Business Logic.",
            "Presentation: Prepare for questions regarding Scalability and State Persistence."
          ]
        }
      },
      Entrepreneur: {
        theme: 'amber',
        sections: [
          { id: 'mvp', label: 'MVP Core Architecture', icon: 'Zap' },
          { id: 'market', label: 'Unit Economics', icon: 'DollarSign' },
          { id: 'roadmap', label: 'GTM Strategy', icon: 'TrendingUp' }
        ],
        content: {
          mvp: [
            "Core Value Prop: Automated workflow engine focusing on the primary user pain point.",
            "Tier 1 Features: User Auth, Data Dashboard, and automated PDF/CSV reporting.",
            "Security: End-to-end encryption for user-generated data to ensure high trust."
          ],
          market: [
            "Model: Tiered SaaS (Freemium, Pro at $29/mo, Enterprise at $199/mo).",
            "Target: Small-to-Medium Businesses (SMBs) in the high-growth tech sector.",
            "Growth: Projected 15% month-over-month growth based on current market demand."
          ],
          roadmap: [
            "Q1: Beta launch to 50 curated testers for high-fidelity feedback loops.",
            "Q2: ProductHunt and HackerNews launch with 'early adopter' discount pricing.",
            "Q3: Strategic API integration with third-party tools (Zapier, Slack)."
          ]
        }
      },
      Hackathon: {
        theme: 'cyan',
        sections: [
          { id: 'pitch', label: 'Winning Pitch Script', icon: 'Mic' },
          { id: 'speed', label: 'Development Hacks', icon: 'FastForward' },
          { id: 'impact', label: 'Judge Scorecards', icon: 'Award' }
        ],
        content: {
          pitch: [
            "0:00-0:45: The Problem. Use a personal story to create an emotional hook.",
            "0:45-1:15: The 'Magic Moment'. Trigger the main animation to show technical depth.",
            "1:15-2:30: Live Demo. Navigate the core happy path; avoid edge cases.",
            "2:30-3:00: Market Vision. Explain how this scales from a toy to a tool."
          ],
          speed: [
            "UI: Use pre-built components (shadcn/ui) to save 8+ hours of styling.",
            "Data: Use mock JSON files; don't build a full CRUD backend yet.",
            "Auth: Implement 'Social Login' only to reduce friction during judge testing."
          ],
          impact: [
            "Visuals: Polish the transitions as judges value UX extremely highly.",
            "Originality: Focus on one 'Impossible' feature that competitors don't have.",
            "Feasibility: Explain how this could run on a real production server."
          ]
        }
      },
      Team: {
        theme: 'purple',
        sections: [
          { id: 'roles', label: 'Workforce Allocation', icon: 'Users' },
          { id: 'tools', label: 'Collaboration Stack', icon: 'Share2' },
          { id: 'sprints', label: 'Agile Roadmap', icon: 'Calendar' }
        ],
        content: {
          roles: [
            "Project Lead: Oversight of technical debt and architectural integrity.",
            "Frontend Architect: Owner of the Design System and Component Library.",
            "Backend/AI Lead: Responsible for API design and prompt engineering.",
            "QA / UX Specialist: Focus on cross-browser testing and accessibility."
          ],
          tools: [
            "GitHub: Main repository with strict branching logic.",
            "Discord/Slack: Real-time syncs and automated CI/CD notifications.",
            "Figma: Low and High-fidelity wireframes with shared styling tokens.",
            "Notion: Centralized documentation and sprint backlogs."
          ],
          sprints: [
            "Sprint 1: Repository initialization, Auth flow, and Base UI layout.",
            "Sprint 2: Core feature implementation and API logic integration.",
            "Sprint 3: Edge-case handling, performance optimization, and bug squashing."
          ]
        }
      }
    };

    const config = modeConfigs[mode] || modeConfigs.Student;

    return {
      problem: idea || "Conceptual gap identified in the target market.",
      metrics,
      ...config
    };
  };

  return (
    <IdeaContext.Provider value={{ 
      userIdea, setUserIdea, 
      selectedMode, setSelectedMode, 
      results, processIdea,
      history, loadHistory
    }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdea = () => useContext(IdeaContext);