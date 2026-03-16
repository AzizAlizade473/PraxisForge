import React, { createContext, useContext, useState, useEffect } from 'react';
import { ideaService } from '../services/ideaService';

const IdeaContext = createContext();

const USE_MOCK_BACKEND = false; 

export const IdeaProvider = ({ children }) => {
  const[userIdea, setUserIdea] = useState('');
  const [selectedMode, setSelectedMode] = useState('Entrepreneur');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  },[]);

  const loadHistory = async () => {
    try {
      const data = await ideaService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const processIdea = async () => {
    try {
      const finalData = await ideaService.generateIdea(selectedMode, userIdea);
      setResults(finalData);
      await loadHistory();
      return { success: true };
    } catch (error) {
      console.error("Failed to process idea:", error);
      return { success: false, error: "Failed to connect to the backend Forge." };
    }
  };

  const refineNode = async (sectionId, itemId, instruction) => {
    try {
      if (USE_MOCK_BACKEND) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResults(prev => {
          const newResults = { ...prev };
          newResults.key_facts = newResults.key_facts.map(fact => 
            fact.id === itemId ? { ...fact, content: `✨ [Refined: ${instruction}] ${fact.content}` } : fact
          );
          return newResults;
        });
        return { success: true };
      } else {
        const projectId = results.projectId; // captured from the generateIdea response
        const updatedFact = await ideaService.updateFact(projectId, itemId, instruction);
        
        setResults(prev => {
          const newResults = { ...prev };
          newResults.key_facts = newResults.key_facts.map(fact => 
            fact.id === itemId ? updatedFact : fact
          );
          return newResults;
        });
        return { success: true };
      }
    } catch(err) {
      console.error("Failed to refine fact:", err);
      return { success: false };
    }
  };

  const generateMockResults = (mode, idea) => {
    const metrics = {
      score: Math.floor(Math.random() * 12) + 85, 
      timeline: mode === 'Hackathon' ? "48 Hours" : mode === 'Student' ? "4 Weeks" : "6 Months",
      difficulty: mode === 'Hackathon' ? "Very High" : "Moderate",
      marketPotential: "Strong / Emerging",
    };

    // Dynamic, mode-specific sections used by the right-side panel.
    // These mirror the structure the real backend is expected to return.
    const sectionsByMode = {
      Student: [
        {
          id: 'tech-stack',
          label: 'Tech Stack',
          content: [
            "Primary Language: JavaScript / TypeScript with React.",
            "Frontend: Vite + Tailwind CSS for rapid UI iteration.",
            "Backend: Supabase or Firebase for auth, DB, and storage.",
            "Dev Tools: GitHub + VS Code + Cursor for AI-assisted learning."
          ]
        },
        {
          id: 'learning-roadmap',
          label: 'Learning Roadmap',
          content: [
            "Week 1: Learn React fundamentals (components, props, state).",
            "Week 2: Add routing, simple forms, and API calls.",
            "Week 3: Connect to a managed backend (Supabase/Firebase).",
            "Week 4: Polish UI, add loading states, and write a short report."
          ]
        },
        {
          id: 'academic-goals',
          label: 'Academic Goals',
          content: [
            "Highlight clear problem statement and target user persona.",
            "Show architecture diagram linking frontend, backend, and database.",
            "Prepare a 5–7 minute demo script aligned with rubric criteria.",
            "Document limitations and future work to demonstrate critical thinking."
          ]
        }
      ],
      Entrepreneur: [
        {
          id: 'competitors',
          label: 'Competitor Analysis',
          content: [
            "Global: Identify 3–5 comparable SaaS products and their core positioning.",
            "Local: Map regional startups serving a similar niche or vertical.",
            "Your Advantage: Focus on 1–2 sharp differentiators (pricing, UX, niche)."
          ]
        },
        {
          id: 'business-roadmap',
          label: 'Business Roadmap',
          content: [
            "Month 1: Validate problem with 10–20 customer interviews.",
            "Month 2: Launch a tightly-scoped MVP to 3–5 design partners.",
            "Month 3: Refine pricing, messaging, and prepare for a seed round narrative."
          ]
        },
        {
          id: 'revenue-model',
          label: 'Revenue Model',
          content: [
            "Primary: Recurring SaaS subscription with tiered feature gates.",
            "Secondary: Optional onboarding / consulting packages.",
            "Long-Term: Data or analytics add-ons once you reach scale."
          ]
        }
      ],
      Hackathon: [
        {
          id: 'tech-stack-hackathon',
          label: 'Tech Stack',
          content: [
            "Frontend: React + Tailwind UI kits for pre-built components.",
            "Backend: Serverless functions (Vercel/Netlify) or Supabase edge functions.",
            "Database: Hosted Postgres with simple, flat schemas.",
            "Auth: Magic links or OAuth providers to avoid custom flows."
          ]
        },
        {
          id: 'roadmap-48h',
          label: '48-Hour Roadmap',
          content: [
            "Hours 0–6: Align on problem, user story, and core demo path.",
            "Hours 6–18: Build core UX and happy-path flow only.",
            "Hours 18–36: Stabilize, add micro-polish, and seed demo data.",
            "Hours 36–48: Rehearse pitch, refine story, and stress-test demo."
          ]
        },
        {
          id: 'pitch-strategy',
          label: 'Pitch Strategy',
          content: [
            "Open with a 1–2 sentence story of the user’s pain.",
            "Demo the product in under 3 minutes, staying on the happy path.",
            "Close with impact: who benefits, what changes, and what’s next."
          ]
        }
      ],
      Team: [
        {
          id: 'tech-stack-team',
          label: 'Tech Stack',
          content: [
            "Monorepo: Use a single repo with clear `frontend/` and `backend/` folders.",
            "Frontend: React + component library to keep UI consistent.",
            "Backend: REST or tRPC with shared types to reduce integration bugs.",
            "Collaboration: Prettier + ESLint + CI to enforce a shared baseline."
          ]
        },
        {
          id: 'agile-roadmap',
          label: 'Agile Roadmap',
          content: [
            "Sprint 0: Define scope, success metrics, and tech stack.",
            "Sprint 1: Ship a vertical slice that exercises end-to-end flow.",
            "Sprint 2: Harden auth, error states, and analytics.",
            "Sprint 3+: Iterate on user feedback with small, frequent releases."
          ]
        },
        {
          id: 'role-distribution',
          label: 'Role Distribution',
          content: [
            "Tech Lead: Owns architecture decisions and code review standards.",
            "Frontend Lead: Owns design system and UX consistency.",
            "Backend Lead: Owns API contracts, data model, and reliability.",
            "PM/Coordinator: Owns backlog, sprint planning, and stakeholder updates."
          ]
        }
      ]
    };

    const sections = sectionsByMode[mode] || sectionsByMode.Student;

    return {
      project_mode: mode,
      summary: idea || "Conceptual gap identified in the market.",
      metrics,
      sections
    };
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
