"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { experiences } from "@/lib/resume-data";
import { HighlightText } from "@/lib/highlight-text";
import { Building2, ChevronRight } from "lucide-react";

export function ExperienceSection() {
  return (
    <section className="mb-12" id="experience">
      <SectionHeader title="Experience" />
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative pl-6 border-l-2 border-border hover:border-accent/50 transition-colors"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-2 border-background" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-lg text-foreground">
                  {exp.company}
                </h3>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {exp.period}
              </span>
            </div>

            <div className="space-y-4">
              {exp.projects.map((project) => (
                <div key={project.name} className="group">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {project.name}
                  </h4>
                  <ul className="space-y-1.5 ml-5">
                    {project.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground leading-relaxed relative before:content-[''] before:absolute before:-left-3 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-muted-foreground/50"
                      >
                        <HighlightText text={highlight} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {exp.activities && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Activities
                </h4>
                <ul className="space-y-1">
                  {exp.activities.map((activity, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-accent/50"
                    >
                      <HighlightText text={activity} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
