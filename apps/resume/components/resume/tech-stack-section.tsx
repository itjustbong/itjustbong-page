"use client";

import React from "react";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { techStacks } from "@/lib/resume-data";
import { HighlightText } from "@/lib/highlight-text";

export function TechStackSection() {
  return (
    <section className="mb-12" id="tech-stack">
      <SectionHeader title="Tech Stack" />
      <div className="space-y-3">
        {techStacks.map((stack, index) => (
          <motion.div
            key={stack.category}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            {/* Category - 고정 너비로 일관성 유지 */}
            <h3 className="font-semibold text-foreground w-20 shrink-0">
              {stack.category}
            </h3>
            
            {/* Tags (1줄) + Description (2줄) */}
            <div className="flex-1 min-w-0 space-y-0.5">
              {/* Tags - 첫 번째 줄 */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                {stack.tags.map((tag, tagIndex) => (
                  <span key={tag} className="inline-flex items-center">
                    <span className="text-sm text-accent font-medium">
                      {tag}
                    </span>
                    {tagIndex < stack.tags.length - 1 && (
                      <span className="text-muted-foreground/40 mx-0.5">·</span>
                    )}
                  </span>
                ))}
              </div>
              {/* Description - 두 번째 줄 */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                <HighlightText text={stack.description} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
