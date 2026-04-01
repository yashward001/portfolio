import type { Profile } from '@/lib/types';

export const profile: Profile = {
  name: 'Yashwardhan Singh Tomar',
  headline: 'Computer Science Student Building AI Systems and Full-Stack Products',
  valueProp:
    'I build production-ready AI systems and polished product experiences, with a focus on practical impact, scalability, and clear engineering tradeoffs.',
  location: 'Singapore',
  phone: '+65 84620058',
  email: 'yashward001@e.ntu.edu.sg',
  resumeUrl: '/resume/Yashwardhan-Singh-Tomar-Resume.pdf',
  github: 'https://github.com/yashward001',
  linkedin: 'https://linkedin.com/in/yashwardhan-singh-tomar',
  stats: [
    { label: 'Internships', value: '4' },
    { label: 'Major Projects', value: '10+' },
    { label: 'Leadership Roles', value: '4' },
    { label: 'CGPA', value: '4.0/5.0' }
  ],
  skills: [
    'Python',
    'C++ (C++20)',
    'Java',
    'JavaScript / TypeScript',
    'PyTorch',
    'Hugging Face',
    'LLMs',
    'Transformers',
    'FAISS / RAG',
    'Gemini API',
    'FastAPI',
    'React',
    'Next.js',
    'WebSockets',
    'REST APIs',
    'PostgreSQL',
    'Parquet',
    'Firestore',
    'Power Automate',
    'Git',
    'Playwright',
    'Vercel',
    'CMake / Ninja',
    'Azure (Copilot Studio)'
  ],
  skillGroups: [
    { category: 'Languages', items: ['Python', 'C++ (C++20)', 'Java', 'JavaScript / TypeScript'] },
    { category: 'ML / AI', items: ['PyTorch', 'Hugging Face', 'LLMs', 'Transformers', 'FAISS / RAG', 'Gemini API'] },
    { category: 'Web & Backend', items: ['FastAPI', 'React', 'Next.js', 'WebSockets', 'REST APIs'] },
    { category: 'Data & Infra', items: ['PostgreSQL', 'Parquet', 'Firestore', 'Power Automate'] },
    { category: 'Tools', items: ['Git', 'Playwright', 'Vercel', 'CMake / Ninja', 'Azure (Copilot Studio)'] }
  ],
  interests: ['Applied AI', 'LLM systems', 'Quant research', 'Full-stack product engineering'],
  timeline: [
    {
      title: 'GenAI Intern, Information Technology Division',
      org: 'Singapore Business Federation',
      start: 'Jan 2026',
      end: 'Jun 2026',
      detail:
        'Built enterprise AI bots in Microsoft Copilot Studio, integrated SharePoint/internal systems, and automated workflows using Power Automate + APIs.'
    },
    {
      title: 'AI Software Development Intern',
      org: 'Gigin.ai',
      start: 'Apr 2025',
      end: 'Present',
      detail:
        'Developed academic document forensics with an ensemble architecture, improving fraud detection accuracy and reducing verification turnaround time.'
    },
    {
      title: 'AI Intern',
      org: 'Proplens AI · NTU Venture Program',
      start: 'Sep 2024',
      end: 'Nov 2024',
      detail:
        'Shipped a production LLM chatbot with entity extraction and knowledge-graph-grounded responses for real estate lead management; added confidence gating and human hand-off to reduce hallucinated answers in low-confidence query paths. (India, Remote)'
    },
    {
      title: 'Machine Learning Intern',
      org: 'STMicroelectronics',
      start: 'May 2024',
      end: 'Jul 2024',
      detail:
        'Optimized transformer deployment for constrained devices with post-training quantization and benchmark-driven latency-memory tradeoff analysis.'
    },
    {
      title: 'B.Eng. Computer Science',
      org: 'Nanyang Technological University (NTU)',
      start: 'Aug 2023',
      end: 'Aug 2027 (Expected)',
      detail:
        'Minor in Business. Relevant focus: machine learning systems, software engineering, data systems, and product development.'
    }
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/yashward001' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yashwardhan-singh-tomar' },
    { label: 'Email', href: 'mailto:yashward001@e.ntu.edu.sg' }
  ]
};
