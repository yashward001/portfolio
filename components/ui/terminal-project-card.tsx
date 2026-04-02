"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: index * 0.08,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/projects/${slug}`}>
        <motion.div
          className="relative border border-[#003d0f] bg-[#0a0f0a] p-6 overflow-hidden"
          animate={{
            height: hovered ? 220 : 160,
            borderColor: hovered ? "#00ff41" : "#003d0f",
            boxShadow: hovered
              ? "0 0 24px rgba(0,255,65,0.15), inset 0 0 24px rgba(0,255,65,0.03)"
              : "none",
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Corner accents on hover */}
          <motion.div
            className="absolute top-0 right-0 w-8 h-8"
            style={{
              borderTop: "1px solid #00ff41",
              borderRight: "1px solid #00ff41",
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-8 h-8"
            style={{
              borderBottom: "1px solid #00ff41",
              borderLeft: "1px solid #00ff41",
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Top line: role + date */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#006622]">
              {role}
            </span>
            <span className="font-mono text-[10px] text-[#004d1a]">
              {date}
            </span>
          </div>

          {/* Title */}
          <motion.h3
            className="font-mono text-base font-bold uppercase tracking-[0.08em] mb-4 leading-tight line-clamp-2"
            animate={{
              color: hovered ? "#00ff41" : "#00cc33",
              textShadow: hovered ? "0 0 12px #00ff41" : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            {`> ${title}`}
          </motion.h3>

          {/* Tags — only on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest border border-[#003d0f] text-[#006622]"
                  >
                    [{tag}]
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stack — always visible */}
          <div className="font-mono text-[10px] tracking-wide text-[#004d1a]">
            {stack.slice(0, 4).join(" · ")}
          </div>

          {/* CTA — animated in on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[#00ff41]"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                [OPEN CASE STUDY ▶]
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}
