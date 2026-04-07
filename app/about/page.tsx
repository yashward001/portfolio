'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { TextScramble } from '@/components/ui/text-scramble';
import { MusicShowcase } from '@/components/music-showcase';
import { profile } from '@/content/profile';

/* ─── Scroll animation preset ───────────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

/* ─── Typewriter hook ────────────────────────────────────────────────────── */
function useTypewriter(text: string, delay = 800, speed = 40) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        setDisplay(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(id);
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay, speed]);
  return display;
}

/* ─── Experience data ────────────────────────────────────────────────────── */
const EXPERIENCE = [
  {
    dates: 'Jan 2026 → Jun 2026',
    company: 'Singapore Business Federation (SBF)',
    location: 'Singapore',
    role: 'GenAI Intern, Information Technology Division',
    status: 'COMPLETED',
    highlight: true,
    bullets: [
      'Deployed Copilot Studio assistants with RAG over SharePoint — chunking, metadata filters, citations, eval sets driving iterative answer-quality gains',
      'Shipped Power Automate + API integrations with telemetry tracking resolution rate, failure reasons, and latency',
    ],
    tags: ['COPILOT STUDIO', 'RAG', 'POWER AUTOMATE', 'SHAREPOINT'],
  },
  {
    dates: 'Apr 2025 → Jul 2025',
    company: 'Gigin.ai',
    location: 'Remote',
    role: 'AI Software Development Intern',
    status: 'COMPLETED',
    highlight: false,
    bullets: [
      'Built document integrity pipeline combining extraction checks, embedding similarity, and layout/metadata heuristics',
      'Achieved 95%+ fraud detection accuracy with 80% reduction in verification time via ablation-tuned ensemble scoring',
    ],
    tags: ['PYTORCH', 'FASTAPI', 'COMPUTER VISION', 'ENSEMBLE ML'],
  },
  {
    dates: 'Sep 2024 → Nov 2024',
    company: 'Proplens AI (NTU Venture Program)',
    location: 'India (Remote)',
    role: 'AI Intern',
    status: 'COMPLETED',
    highlight: false,
    bullets: [
      'Shipped production LLM chatbot with entity extraction and knowledge-graph-grounded responses for real estate lead management',
      'Added confidence gating and human hand-off, reducing hallucinated answers in low-confidence query paths',
    ],
    tags: ['LLM', 'KNOWLEDGE GRAPH', 'FASTAPI'],
  },
  {
    dates: 'May 2024 → Jul 2024',
    company: 'STMicroelectronics',
    location: 'Singapore',
    role: 'Machine Learning Intern',
    status: 'COMPLETED',
    highlight: false,
    bullets: [
      'Eliminated run-to-run noise in model benchmarking: designed statistically rigorous harness with fixed seeds, pinned thread affinity, and repeated trials producing stable p50/p95/p99 latency',
      'Cut model memory footprint via post-training quantization (INT8/FP16) on transformer models for edge devices — 30% latency reduction, 25% memory efficiency improvement',
    ],
    tags: ['PYTORCH', 'QUANTIZATION', 'TRANSFORMERS', 'HUGGING FACE'],
  },
  {
    dates: 'Aug 2023 → Aug 2027',
    company: 'Nanyang Technological University (NTU)',
    location: 'Singapore',
    role: 'B.Eng. Computer Science · Minor in Business',
    status: 'IN PROGRESS',
    highlight: false,
    isEdu: true,
    bullets: [
      'Concentrations: Intelligence and Modelling/Simulations',
      'Relevant: Data Structures, OS, Computer Networks, ML, Database Systems, Probability & Statistics',
    ],
    tags: ['CS', 'ML', 'NTU', 'SINGAPORE'],
  },
];

/* ─── Skills data ────────────────────────────────────────────────────────── */
const SKILLS = [
  { group: 'LANGUAGES', items: ['Python', 'C++20', 'Java', 'TypeScript', 'JavaScript'] },
  { group: 'ML / AI',   items: ['PyTorch', 'Hugging Face', 'LLMs', 'Transformers', 'FAISS', 'Gemini API'] },
  { group: 'WEB',       items: ['FastAPI', 'React', 'Next.js', 'WebSockets', 'REST APIs'] },
  { group: 'DATA',      items: ['PostgreSQL', 'Firestore', 'Parquet', 'Power Automate'] },
  { group: 'SYSTEMS',   items: ['Linux', 'CMake', 'Ninja', 'Playwright', 'Benchmarking'] },
  { group: 'TOOLS',     items: ['Git', 'Vercel', 'Azure', 'Copilot Studio', 'Weights & Biases'] },
];

/* ─── System status rows ─────────────────────────────────────────────────── */
const STATUS_ROWS = [
  { key: 'NODE',     val: 'Yashwardhan S. Tomar' },
  { key: 'STATUS',   val: 'Active / Available' },
  { key: 'LOCATION', val: 'Singapore' },
  { key: 'DEGREE',   val: 'B.Eng CS, NTU' },
  { key: 'GRAD',     val: 'Aug 2027' },
  { key: 'FOCUS',    val: 'Agentic Systems' },
  { key: '',         val: 'ML Infrastructure' },
  { key: '',         val: 'Full-Stack Product' },
];

/* ─── Research interests ─────────────────────────────────────────────────── */
const RESEARCH = [
  {
    title: 'EFFICIENT ML INFERENCE',
    desc: 'Transformer quantization for edge deployment — INT8/FP16 Pareto analysis, latency-memory tradeoffs on constrained hardware.',
  },
  {
    title: 'AGENTIC SYSTEM DESIGN',
    desc: 'Formal state machines for agent orchestration, capability registries, and production-grade fallback/recovery architectures.',
  },
  {
    title: 'NEUROMORPHIC COMPUTING',
    desc: 'Spiking neural networks (LIF neurons, STDP, surrogate gradients) and their intersection with transformer sequence modelling.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  const terminalLine = useTypewriter(
    'root@yst:~/about$ whoami → Yashwardhan Singh Tomar',
    1200,
    38,
  );

  return (
    <div className="space-y-0">

      {/* ── SECTION 1: HERO BAND ─────────────────────────────────────────── */}
      <section className="border-b border-[#003d0f] px-6 pb-16 pt-20 text-center">
        <motion.div {...fadeUp} className="space-y-4">
          <h1 className="font-mono text-3xl font-bold uppercase tracking-[0.12em] text-[#00ff41] sm:text-5xl"
            style={{ textShadow: '0 0 20px rgba(0,255,65,0.35)' }}>
            <TextScramble text="ENGINEERING WITH PRODUCT TASTE" delay={100} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="font-mono text-sm text-[#33ff66] tracking-wide"
          >
            NTU Computer Science · AI Systems · Agentic Infrastructure
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="font-mono text-[11px] text-[#00aa44] min-h-[18px]"
          >
            {terminalLine}
            <span className="animate-pulse">█</span>
          </motion.p>
        </motion.div>
      </section>

      {/* ── SECTION 2: BIO + QUICK STATS ─────────────────────────────────── */}
      <section className="grid gap-8 border-b border-[#003d0f] px-6 py-14 lg:grid-cols-[3fr_2fr]">
        {/* Left — bio */}
        <motion.div {...fadeUp} className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
            &gt; ABOUT_ME.txt
          </p>
          <p className="font-mono text-base leading-[1.8] text-white/80">
            I am a CS student who likes hard system constraints and user-facing polish in the same
            product. I enjoy end-to-end ownership: defining problem boundaries, making architecture
            decisions, and shipping interfaces that feel intentional. Most of my work lives at the
            intersection of agentic AI systems and full-stack product engineering.
          </p>
          <div className="flex flex-wrap gap-2">
            {['APPLIED AI', 'LLM SYSTEMS', 'QUANT RESEARCH', 'FULL-STACK'].map((tag) => (
              <span
                key={tag}
                className="border border-[#003d0f] px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-[#00aa44] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
              >
                [{tag}]
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right — system status panel */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
          <div className="border border-[#003d0f] bg-[#0a0f0a] p-5 font-mono text-[11px]">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#003d0f]">
              ┌─── SYSTEM_STATUS ─────────────────────┐
            </p>
            <div className="space-y-1.5">
              {STATUS_ROWS.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className="flex gap-3"
                >
                  <span className="w-20 shrink-0 text-[#00aa44]">
                    {row.key ? `  ${row.key}` : ''}
                  </span>
                  <span className="text-white/75">{row.val}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[10px] tracking-[0.25em] text-[#003d0f]">
              └───────────────────────────────────────┘
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 3: EXPERIENCE TIMELINE ───────────────────────────────── */}
      <section className="border-b border-[#003d0f] px-6 py-14">
        <motion.p {...fadeUp} className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-[#00aa44]">
          &gt; EXPERIENCE.log
        </motion.p>

        <div className="relative space-y-6">
          {/* Vertical connector line */}
          <div className="absolute left-0 top-0 h-full w-px bg-[#003d0f]" />

          {EXPERIENCE.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-6"
            >
              {/* Timeline node */}
              <div
                className={`absolute -left-[3px] top-5 h-1.5 w-1.5 ${entry.highlight ? 'bg-[#00ff41]' : entry.status === 'ACTIVE' ? 'bg-[#33ff66]' : 'bg-[#003d0f]'}`}
              />

              <div
                className={`border bg-[#0a0f0a] p-5 transition-colors hover:border-[#00ff41]/50 ${
                  entry.highlight
                    ? 'border-[#00ff41]'
                    : entry.isEdu
                    ? 'border-[#003d0f]'
                    : 'border-[#003d0f]'
                }`}
              >
                {/* Header row */}
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[10px] text-[#00aa44]">{entry.dates}</p>
                    <p className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                      {entry.company}
                    </p>
                    <p className="font-mono text-[10px] text-[#00aa44]">{entry.location}</p>
                  </div>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-0.5 ${
                      entry.status === 'ACTIVE'
                        ? 'border-[#33ff66] text-[#33ff66]'
                        : entry.status === 'IN PROGRESS'
                        ? 'border-[#00aa44] text-[#00aa44]'
                        : 'border-[#003d0f] text-[#00aa44]'
                    }`}
                  >
                    [{entry.status}]
                  </span>
                </div>

                {/* Divider */}
                <div className="mb-3 border-t border-[#003d0f]" />

                {/* Role */}
                <p className="mb-3 font-mono text-sm font-semibold text-[#00ff41]">
                  {entry.role}
                </p>

                {/* Bullets */}
                <ul className="mb-4 space-y-2">
                  {entry.bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-2 font-mono text-xs leading-relaxed text-white/70">
                      <span className="mt-0.5 shrink-0 text-[#00aa44]">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#003d0f] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#00aa44]"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: MUSIC SHOWCASE ────────────────────────────────────── */}
      <MusicShowcase />

      {/* ── SECTION 5: SKILLS MATRIX ────────────────────────────────────── */}
      <section className="border-b border-[#003d0f] px-6 py-14">
        <motion.p {...fadeUp} className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-[#00aa44]">
          &gt; SKILLS_MATRIX.json
        </motion.p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((group, gi) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: gi * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00ff41]">
                [{group.group}]
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item, ii) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 + ii * 0.04 }}
                    className="border border-[#003d0f] px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-[#33ff66] transition-colors hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_6px_rgba(0,255,65,0.2)]"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: RESEARCH INTERESTS ────────────────────────────────── */}
      <section className="border-b border-[#003d0f] bg-[#0d1a0d] px-6 py-14">
        <motion.p {...fadeUp} className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-[#00aa44]">
          &gt; RESEARCH_INTERESTS.log
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="border border-[#003d0f] bg-black/40 p-5 space-y-3"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#00ff41]">
                {item.title}
              </p>
              <p className="font-mono text-xs leading-relaxed text-white/70">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: AVAILABILITY BAND ─────────────────────────────────── */}
      <motion.section
        {...fadeUp}
        className="border border-[#003d0f] bg-[#0a0f0a] px-6 py-10 space-y-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
          &gt; QUERY: available_roles
        </p>
        <p className="max-w-xl font-mono text-sm leading-relaxed text-white/75">
          Research opportunities in ML systems, agentic AI, or efficient inference for 2026.
          Full-time software engineering roles from mid-2027.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="focus-ring border border-[#00ff41] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
          >
            /CONTACT ▶
          </Link>
          <a
            href={profile.resumeUrl}
            className="focus-ring border border-[#003d0f] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[#00aa44] transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
          >
            DOWNLOAD RESUME ▶
          </a>
        </div>
      </motion.section>

    </div>
  );
}
