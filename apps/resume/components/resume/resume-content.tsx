"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import { profile } from "@/lib/resume-data";
import { TechStackSection } from "./tech-stack-section";
import { ExperienceSection } from "./experience-section";
import { ProjectsSection } from "./projects-section";
import { EducationSection } from "./education-section";
import { AwardsSection } from "./awards-section";
import type { Project } from "@/lib/resume-data";

interface ResumeContentProps {
  onProjectPreview: (project: Project) => void;
  isPanelOpen: boolean;
  onPdfDownload?: () => void;
}

export const ResumeContent = forwardRef<HTMLDivElement, ResumeContentProps>(
  function ResumeContent({ onProjectPreview, isPanelOpen, onPdfDownload }, ref) {
    return (
      <motion.main
        ref={ref}
        animate={{
          marginRight: isPanelOpen ? 375 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="min-h-screen bg-background"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            {/* 이름 + 소셜 링크 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold text-foreground">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Github className="w-4 h-4" />
                  {profile.links.github.replace("https://github.com/", "")}
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  {profile.links.linkedin.replace("https://www.linkedin.com/in/", "").replace("/", "")}
                </a>
                <a
                  href={`mailto:${profile.links.email}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {profile.links.email}
                </a>
              </div>
            </div>
            
            {/* 타이틀 + PDF 버튼 */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg text-muted-foreground">{profile.title}</p>
              {onPdfDownload && (
                <button
                  onClick={onPdfDownload}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-colors print:hidden"
                  aria-label="PDF 다운로드"
                >
                  <FileDown className="w-4 h-4" />
                  <span>PDF</span>
                </button>
              )}
            </div>
            
            {profile.tagline && (
              <p className="text-sm text-muted-foreground/80 mt-2">
                {profile.tagline}
              </p>
            )}
          </motion.section>

          {/* Resume Sections */}
          <TechStackSection />
          <ExperienceSection />
          <ProjectsSection onPreview={onProjectPreview} />
          <EducationSection />
          <AwardsSection />
        </div>
      </motion.main>
    );
  }
);
