"use client";

import { useState, useRef, useCallback } from "react";
import { ResumeContent } from "@/components/resume/resume-content";
import { ProjectPreviewPanel } from "@/components/resume/project-preview-panel";
import { FeatureNotification } from "@/components/resume/feature-notification";
import { PdfResumeContent } from "@/components/resume/pdf-resume-content";
import { generatePdf } from "@/lib/pdf-generator";
import type { Project } from "@/lib/resume-data";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResumePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleProjectPreview = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handlePdfDownload = useCallback(async () => {
    if (!pdfRef.current) return;
    
    try {
      await generatePdf(pdfRef.current, {
        filename: "봉승우_이력서.pdf",
        scale: 1.5,
        margin: 5,
        imageFormat: "JPEG",
        imageQuality: 0.85,
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }, []);

  return (
    <div className="relative">
      <ResumeContent
        ref={resumeRef}
        onProjectPreview={handleProjectPreview}
        isPanelOpen={!!selectedProject && !isMobile}
        onPdfDownload={handlePdfDownload}
      />

      <ProjectPreviewPanel
        project={selectedProject}
        onClose={handleClosePreview}
      />

      {/* PDF 전용 컨텐츠 (숨김 처리, PDF 생성 시에만 사용) */}
      <PdfResumeContent ref={pdfRef} />

      {/* 첫 방문 사용자를 위한 기능 안내 노티피케이션 */}
      <FeatureNotification displayDuration={3000} />
    </div>
  );
}
