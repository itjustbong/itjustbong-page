"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./section-header";
import { personalProjects, type Project } from "@/lib/resume-data";
import { HighlightText } from "@/lib/highlight-text";
import { ExternalLink, Eye, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsSectionProps {
  onPreview: (project: Project) => void;
}

export function ProjectsSection({ onPreview }: ProjectsSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section className="mb-12" id="projects">
      <SectionHeader title="Personal Projects" icon={<Rocket className="w-5 h-5" />} />
      <div className="space-y-6">
        {personalProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative p-5 rounded-lg bg-card border border-border hover:border-accent/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex-1">
                <div
                  className="relative inline-block"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <h3 className="font-semibold text-lg text-foreground cursor-pointer hover:text-accent transition-colors inline-flex items-center gap-2">
                    {project.name}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </h3>

                  {/* Hover Preview Tooltip */}
                  <AnimatePresence>
                    {hoveredProject === project.id && project.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 z-50 w-64 h-40 rounded-lg overflow-hidden shadow-xl border border-border bg-card"
                      >
                        <img
                          src={project.image}
                          alt={`${project.name} preview`}
                          className="w-full h-full object-cover object-left-top"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <HighlightText text={project.description} />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                  {project.period}
                </span>
                {project.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(project)}
                    className="text-xs h-7 px-2"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                )}
              </div>
            </div>

            <ul className="space-y-1.5">
              {project.highlights.map((highlight, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/50"
                >
                  <HighlightText text={highlight} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
