import api from './api';

export const praxisService = {
  createProject: async (name, description, mode) => {
    const response = await api.post('/projects/', {
      name,
      description,
      mode,
    });
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProjectSummary: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/summary/`);
    return response.data;
  },

  getBrainSummary: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/brain/summary`);
    return response.data;
  },

  getTasks: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks/`);
    return response.data;
  },

  createTask: async (projectId, task) => {
    const response = await api.post(`/projects/${projectId}/tasks/`, task);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // ── Chat endpoints (exact API spec) ──────────────────────────
  getChatHistory: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/chat/history`);
    return response.data;
  },

  sendMessage: async (projectId, message) => {
    const response = await api.post(`/projects/${projectId}/chat/`, { message });
    return response.data;
  },

  clearChat: async (projectId) => {
    await api.delete(`/projects/${projectId}/chat/history`);
  },

  // ── Roadmap (dynamically generated from project summary) ─────
  getRoadmap: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/roadmap`);
      return response.data;
    } catch {
      // No dedicated roadmap endpoint yet — build one from the project summary
      try {
        const summary = await api.get(`/projects/${projectId}/summary/`);
        return generateRoadmapFromSummary(summary.data);
      } catch {
        return [];
      }
    }
  },
};

/* ═══════════════════════════════════════════════════════════════
   Helper: build a smart, contextual roadmap from ProjectSummary
   ═══════════════════════════════════════════════════════════════ */
function generateRoadmapFromSummary(s) {
  const projectName = s.project_name || 'This Project';
  const mode = (s.project_mode || '').toLowerCase();
  const arch = s.architecture_overview || '';
  const dbInfo = s.recommended_db_structure || '';
  const insights = s.key_insights || [];
  const facts = (s.key_facts || []).map((f) => f.content || f).filter(Boolean);
  const taskOverview = s.task_overview || {};
  const totalTasks = Object.values(taskOverview).reduce((a, b) => a + (b || 0), 0);

  // Extract technology keywords from the architecture overview
  const techKeywords = extractTechTerms(arch);
  const dbKeywords = extractTechTerms(dbInfo);

  const roadmap = [
    {
      step: 1,
      title: `Discovery & Strategic Analysis`,
      duration: mode === 'hackathon' ? 'Day 1' : 'Week 1–2',
      description: `Define the vision for ${projectName}, validate assumptions, and map the competitive landscape.${
        insights.length > 0 ? ` Key insight: "${insights[0]}"` : ''
      }`,
      key_tasks: [
        'Define target audience & user personas',
        facts[0] ? `Validate: ${truncate(facts[0], 60)}` : 'Stakeholder interviews & requirements',
        'Competitive analysis & market positioning',
        'Risk assessment & mitigation planning',
      ],
    },
    {
      step: 2,
      title: `Architecture & System Design`,
      duration: mode === 'hackathon' ? 'Day 1–2' : 'Week 3–4',
      description: arch
        ? `${truncate(arch, 200)}`
        : `Design the system architecture, select the technology stack, and define data models for ${projectName}.`,
      key_tasks: [
        techKeywords.length > 0
          ? `Tech stack: ${techKeywords.slice(0, 4).join(', ')}`
          : 'Select technology stack & frameworks',
        dbKeywords.length > 0
          ? `Database: ${dbKeywords.slice(0, 3).join(', ')}`
          : 'Design database schema & data models',
        'Define API contracts & integration points',
        'Create UI/UX wireframes & design system',
      ],
    },
    {
      step: 3,
      title: `Core Development Sprint`,
      duration: mode === 'hackathon' ? 'Day 2–5' : 'Week 5–8',
      description: `Build the core features and ${
        totalTasks > 0 ? `deliver on ${totalTasks} identified tasks` : 'implement the primary user flows'
      } for ${projectName}.${facts[1] ? ` Focus: ${truncate(facts[1], 80)}` : ''}`,
      key_tasks: [
        'Backend API & business logic implementation',
        'Frontend component library & pages',
        facts[2] ? truncate(facts[2], 55) : 'Core feature development',
        insights[1] ? truncate(insights[1], 55) : 'Authentication & authorization',
      ],
    },
    {
      step: 4,
      title: `Integration & Quality Assurance`,
      duration: mode === 'hackathon' ? 'Day 5–6' : 'Week 9–10',
      description: `Rigorous testing cycle for ${projectName} — ensure reliability, performance, and a polished user experience.`,
      key_tasks: [
        'End-to-end integration testing',
        'Performance benchmarking & optimization',
        'Security audit & vulnerability scanning',
        'User acceptance testing sessions',
      ],
    },
    {
      step: 5,
      title: `Launch & Growth`,
      duration: mode === 'hackathon' ? 'Day 7' : 'Week 11–12',
      description: `Deploy ${projectName} to production, establish monitoring, and begin the growth & iteration cycle.${
        insights[2] ? ` Growth lever: "${truncate(insights[2], 70)}"` : ''
      }`,
      key_tasks: [
        'Production deployment & CI/CD pipeline',
        'Monitoring, alerting & logging setup',
        'User onboarding & documentation',
        'Feedback collection & iteration roadmap',
      ],
    },
  ];

  return roadmap;
}

function extractTechTerms(text) {
  if (!text) return [];
  const techPatterns = /\b(React|Next\.js|Node|Express|FastAPI|Django|Flask|PostgreSQL|MongoDB|Redis|Docker|Kubernetes|AWS|GCP|Azure|Supabase|Firebase|GraphQL|REST|TypeScript|Python|Tailwind|Prisma|SQLAlchemy|Celery|RabbitMQ|Kafka|Nginx|S3|Lambda|Vercel|Railway)\b/gi;
  const matches = text.match(techPatterns) || [];
  return [...new Set(matches)];
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str;
}
