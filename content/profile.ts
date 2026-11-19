import type { Profile } from '@/lib/types';

// Single source of truth for experience, skills and contact details.
// Keep in sync with public/resume/Yashwardhan-Singh-Tomar-Resume.pdf.

const skillGroups = [
  {
    category: 'Languages',
    items: ['C++ (C++20)', 'Python', 'Java', 'JavaScript / TypeScript']
  },
  {
    category: 'Cloud & AI Platforms',
    items: [
      'Vertex AI',
      'Gemini API',
      'Google ADK',
      'Hugging Face',
      'AWS',
      'Azure',
      'Ollama',
      'Claude / MCP'
    ]
  },
  {
    category: 'ML & GenAI',
    items: [
      'PyTorch',
      'TensorFlow',
      'INT8/FP16 quantisation',
      'FAISS / RAG',
      'NLP (transformers, embeddings)',
      'Agent design'
    ]
  },
  {
    category: 'Systems & Infrastructure',
    items: [
      'Linux / Unix',
      'TCP/IP networking',
      'REST APIs',
      'FastAPI',
      'SQL (PostgreSQL)',
      'Firestore',
      'Latency profiling',
      'Python scripting'
    ]
  }
];

export const profile: Profile = {
  name: 'Yashwardhan Singh Tomar',
  headline:
    'Computer Science Student Building AI Systems and Full-Stack Products',
  valueProp:
    'I build production-ready AI systems and polished product experiences, with a focus on practical impact, scalability, and clear engineering tradeoffs.',
  location: 'Singapore',
  coordinates: '1.3521° N, 103.8198° E',
  availability: 'Open to work',
  // Drop a square photo at public/images/avatar.jpg and uncomment to replace the initials.
  // avatar: '/images/avatar.jpg',
  phone: '+65 8462 0058',
  email: 'yashwardhansingh.tomar@outlook.com',
  resumeUrl: '/resume/Yashwardhan-Singh-Tomar-Resume.pdf',
  github: 'https://github.com/yashward001',
  linkedin: 'https://linkedin.com/in/yashwardhan-singh-tomar',
  stats: [
    { label: 'Internships', value: '5' },
    { label: 'Major Projects', value: '10+' },
    { label: 'Leadership Roles', value: '2' },
    { label: 'Hackathon Wins', value: '1' }
  ],
  skills: skillGroups.flatMap((group) => group.items),
  skillGroups,
  interests: [
    'Applied AI',
    'LLM systems',
    'Quant research',
    'Full-stack product engineering'
  ],
  timeline: [
    {
      title: 'Machine Learning Intern',
      org: 'Panasonic Research',
      location: 'Singapore',
      start: 'Aug 2026',
      end: 'Oct 2026',
      bullets: [
        'Exploring ADAS applications of time-series foundation models, including Chronos-2, TimesFM, Moirai 2.0, TTM, and MOMENT.',
        'Built ML classifiers for seven semiconductor bonding defects across 284 runs using grouped cross-validation.',
        'Analyzed generalization, class imbalance, and distribution shift through statistical testing and error analysis.'
      ],
      tags: ['Time series', 'Foundation models', 'ADAS', 'Classification']
    },
    {
      title: 'Solution Architect Intern, Information Technology Division',
      org: 'Singapore Business Federation (SBF)',
      location: 'Singapore',
      start: 'Jan 2026',
      end: 'Jun 2026',
      bullets: [
        'Designed and deployed Copilot Studio assistants adopted across internal teams; mapped SharePoint knowledge to RAG retrieval and evaluation workflows, then resolved chunking gaps, metadata filter mismatches, and citation errors to improve production answer quality.',
        'Architected Power Automate and API workflows for ticketing, approvals, and lookup; built telemetry for resolution rate, failure reasons, and latency to accelerate incident triage.'
      ],
      tags: ['Copilot Studio', 'RAG', 'Power Automate', 'SharePoint']
    },
    {
      title: 'AI Software Development Intern',
      org: 'Gigin.ai',
      location: 'On-site, Bengaluru, India',
      start: 'Apr 2025',
      end: 'Jul 2025',
      bullets: [
        'Debugged and hardened a document integrity ML pipeline: identified failure modes across extraction checks, embedding similarity, and layout/metadata heuristics; reproduced edge-case degradation and tuned ensemble thresholds via ablation to achieve production-grade reliability.',
        'Owned iterative threshold calibration with labeled evaluation sets, documenting each calibration round with failure analysis and precision/recall trade-off rationale — creating a reproducible debugging record that enabled confident production rollout at scale.'
      ],
      tags: ['ML pipelines', 'Embeddings', 'Ensemble ML', 'Evaluation']
    },
    {
      title: 'AI Intern',
      org: 'Proplens AI',
      location: 'Part-time, Singapore',
      start: 'Sep 2024',
      end: 'Nov 2024',
      bullets: [
        'Shipped a production LLM chatbot and resolved model performance issues in deployment: added confidence gating and human hand-off to address hallucination failures in low-confidence query paths; entity extraction and knowledge-graph grounding improved response correctness for production traffic.'
      ],
      tags: ['LLMs', 'Knowledge graphs', 'Entity extraction']
    },
    {
      title: 'Machine Learning Intern',
      org: 'STMicroelectronics',
      location: 'On-site, Greater Noida, India',
      start: 'May 2024',
      end: 'Jul 2024',
      bullets: [
        'Diagnosed and eliminated run-to-run variability in ML model benchmarking: scripted a rigorous harness in Python (fixed seeds, pinned thread affinity, controlled warmup, repeated trials) producing stable p50/p95/p99 latency distributions — enabling confident performance comparisons across INT8/FP16 quantisation schemes.',
        'Reduced model memory footprint via post-training quantisation (INT8/FP16) using PyTorch on transformer models for deployment; systematically mapped accuracy–latency–memory Pareto trade-offs, producing documented deployment recommendations for each quantisation configuration.'
      ],
      tags: ['PyTorch', 'Quantisation', 'Transformers', 'Benchmarking']
    },
    {
      title: 'B.Eng. Computer Science · Minor in Business',
      org: 'Nanyang Technological University (NTU)',
      location: 'Singapore',
      start: 'Aug 2023',
      end: 'Aug 2027',
      education: true,
      current: true,
      bullets: [
        'Relevant coursework: Data Structures & Algorithms · Operating Systems · Computer Networks · Probability & Statistics · Machine Learning'
      ],
      tags: ['Computer Science', 'Machine Learning', 'Business']
    }
  ],
  awards: [
    {
      title: 'Winner, Singapore-India Hackathon 2026',
      detail:
        'Sustainability & Climate Action track · Built Farmora, AI crop planning for FPOs',
      date: 'Nov 2026'
    }
  ],
  leadership: [
    { role: 'Media Lead', org: 'NTU School of Computing & Data Science' },
    { role: 'Marketing', org: 'Intl. Trading Club (NTU)' }
  ],
  venture: {
    name: 'Soft Launch',
    slug: 'soft-launch',
    role: 'Co-founder',
    cofounder: 'Tushar Kapoor',
    tagline: 'Built for the date, not the swipe.',
    summary:
      'A dating app for 18 to 25 year olds in Delhi NCR that ends in a booked table, not another chat thread. Everyone gets one guaranteed match a week, and we only make money when people actually go on dates.',
    status: 'Raising',
    pitchUrl: 'https://soft-launch-pitch.vercel.app',
    deckUrl: 'https://soft-launch-deck.vercel.app'
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/yashward001' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/yashwardhan-singh-tomar'
    },
    { label: 'Email', href: 'mailto:yashwardhansingh.tomar@outlook.com' }
  ]
};
