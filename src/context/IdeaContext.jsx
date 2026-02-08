import React, { createContext, useContext, useState, useEffect } from 'react';

const IdeaContext = createContext();

export const IdeaProvider = ({ children }) => {
  const [userIdea, setUserIdea] = useState('');
  const [selectedMode, setSelectedMode] = useState('Student');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('forge_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

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
            "Styling: Tailwind CSS utilizing a utility-first approach for responsive design.",
            "Backend: Supabase for PostgreSQL database management and built-in GoTrue Auth.",
            "State: Global state management via React Context API or Zustand for lightweight logic.",
            "Deployment: Vercel Edge Functions for low-latency global delivery."
          ],
          steps: [
            "Phase 1: Environment orchestration, Git branching strategy, and atomic component design.",
            "Phase 2: Database schema normalization and Row Level Security (RLS) configuration.",
            "Phase 3: Integration of asynchronous API calls and custom React hooks for data fetching.",
            "Phase 4: Finalizing technical documentation (README.md) and deployment pipelines."
          ],
          academic: [
            "Documentation Focus: Deep dive into the Component Lifecycle and Data Flow diagrams.",
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
            "Exclusions: Postpone advanced social integrations; focus on internal utility metrics.",
            "Security: End-to-end encryption for user-generated data to ensure high trust."
          ],
          market: [
            "Model: Tiered SaaS (Freemium, Pro at $29/mo, Enterprise at $199/mo).",
            "Target: Small-to-Medium Businesses (SMBs) in the high-growth tech sector.",
            "Growth: Projected 15% month-over-month growth based on current market demand.",
            "LTV/CAC: Aiming for a 3:1 ratio through organic LinkedIn and SEO outreach."
          ],
          roadmap: [
            "Q1: Beta launch to 50 curated testers for high-fidelity feedback loops.",
            "Q2: ProductHunt and HackerNews launch with 'early adopter' discount pricing.",
            "Q3: Strategic API integration with third-party tools (Zapier, Slack, Notion).",
            "Q4: Series A preparation with proven traction and churn rate below 4%."
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
            "0:00-0:45: The Problem. Use a personal story to create an immediate emotional hook.",
            "0:45-1:15: The 'Magic Moment'. Trigger the AI Forge animation to show technical depth.",
            "1:15-2:30: Live Demo. Navigate the core happy path; avoid edge cases during the demo.",
            "2:30-3:00: Market Vision. Briefly explain how this scales from a toy to a tool."
          ],
          speed: [
            "UI: Use pre-built components (shadcn/ui or HeadlessUI) to save 8+ hours of styling.",
            "Data: Use mock JSON files for complex data sets; don't build a full CRUD backend yet.",
            "Auth: Implement 'Social Login' only to reduce friction during judge testing.",
            "Styling: Stick to a 3-color palette to maintain visual consistency without effort."
          ],
          impact: [
            "Visuals: Polish the transitions (Framer Motion) as judges value UX extremely highly.",
            "Originality: Focus on one 'Impossible' feature that competitors don't have.",
            "Feasibility: Be ready to explain how this could run on a real production server."
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
            "Backend/AI Lead: Responsible for API design and prompt engineering accuracy.",
            "QA / UX Specialist: Focus on cross-browser testing and accessibility (a11y)."
          ],
          tools: [
            "GitHub: Main repository with 'Main', 'Develop', and 'Feature' branching logic.",
            "Discord/Slack: Real-time syncs and automated CI/CD deployment notifications.",
            "Figma: Low and High-fidelity wireframes with shared styling tokens.",
            "Notion: Centralized documentation, sprint backlogs, and meeting minutes."
          ],
          sprints: [
            "Sprint 1: Repository initialization, Auth flow, and Base UI layout.",
            "Sprint 2: Core feature implementation and AI logic integration.",
            "Sprint 3: Edge-case handling, performance optimization, and bug squashing.",
            "Sprint 4: Final deployment, user acceptance testing, and project hand-off."
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

  const processIdea = () => {
    const finalData = generateMockResults(selectedMode, userIdea);
    setResults(finalData);

    const newHistoryItem = {
      id: Date.now(),
      title: userIdea.length > 0 ? userIdea.substring(0, 30) + "..." : "New Project",
      mode: selectedMode,
      date: new Date().toLocaleDateString()
    };
    
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('forge_history', JSON.stringify(updatedHistory));
  };

  return (
    <IdeaContext.Provider value={{ 
      userIdea, setUserIdea, 
      selectedMode, setSelectedMode, 
      results, processIdea,
      history 
    }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdea = () => useContext(IdeaContext);