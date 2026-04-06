"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

// Adapted from 21st.dev "Dark Grid" component — corner accent squares on hover,
// inner glow, dark bg — recolored to terminal green theme.

interface TerminalProjectCardProps {
  title: string;
  role: string;
  date: string;
  slug: string;
  tags: string[];
  stack: string[];
  index: number;
}

export function TerminalProjectCard({
  title,
  role,
  date,
  slug,
  tags,
  stack,
  index,
}: TerminalProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 26,
        delay: index * 0.07,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative"
    >
      <Link href={`/projects/${slug}`} className="block">
        <motion.div
          className="group relative overflow-visible border border-[#003d0f] bg-[#0a0f0a] p-6 overflow-hidden"
          animate={{
            height: hovered ? 220 : 160,
            borderColor: hovered ? "#00ff41" : "#003d0f",
          }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* ── Inner glow on hover (21st.dev Dark Grid pattern) ── */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.04] via-[#00ff41]/[0.02] to-transparent" />
          </div>

          {/* ── Corner square accents (21st.dev Dark Grid pattern, green) ── */}
          <AnimatePresence>
            {hovered && (
              <>
                <motion.div
                  className="pointer-events-none absolute -left-[3px] -top-[3px] h-2.5 w-2.5 bg-[#00ff41]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.div
                  className="pointer-events-none absolute -right-[3px] -top-[3px] h-2.5 w-2.5 bg-[#00ff41]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15, delay: 0.03 }}
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-2.5 w-2.5 bg-[#00ff41]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15, delay: 0.03 }}
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-2.5 w-2.5 bg-[#00ff41]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15, delay: 0.06 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col gap-3">
            {/* Role + date */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#006622]">
                {role}
              </span>
              <span className="font-mono text-[10px] text-[#004d1a]">{date}</span>
            </div>

            {/* Title */}
            <motion.h3
              className="font-mono text-base font-bold uppercase tracking-[0.08em] leading-tight line-clamp-2"
              animate={{ color: hovered ? "#00ff41" : "#ffffff" }}
              transition={{ duration: 0.18 }}
            >
              {`> ${title}`}
            </motion.h3>

            {/* Stack — always visible */}
            <p className="font-mono text-[10px] text-[#004d1a]">
              {stack.slice(0, 4).join(" · ")}
            </p>

            {/* Tags + CTA — revealed on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] px-1.5 py-0.5 border border-[#003d0f] text-[#006622] uppercase tracking-widest"
                      >
                        [{tag}]
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#00ff41]">
                    [OPEN CASE STUDY ▶]
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
