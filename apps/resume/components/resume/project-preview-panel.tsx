"use client";

import React from "react"

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/resume-data";
import { X, GripVertical, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectPreviewPanelProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectPreviewPanel({
  project,
  onClose,
}: ProjectPreviewPanelProps) {
  const isMobile = useIsMobile();
  const [panelWidth, setPanelWidth] = useState(375);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // 드래그 상태를 ref로 관리하여 클로저 문제 방지
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startWidth: 0,
  });

  const MIN_WIDTH = 320;
  const MAX_WIDTH_RATIO = 0.6;

  useEffect(() => {
    setIsLoading(true);
  }, [project?.id]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;
    
    e.preventDefault();
    const delta = dragStateRef.current.startX - e.clientX;
    const maxWidth = window.innerWidth * MAX_WIDTH_RATIO;
    const newWidth = Math.min(
      maxWidth,
      Math.max(MIN_WIDTH, dragStateRef.current.startWidth + delta)
    );
    setPanelWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;
    
    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startWidth: panelWidth,
    };
    
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [panelWidth, handleMouseMove, handleMouseUp]);

  // 컴포넌트 언마운트 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!project) return null;

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[85vh] bg-background rounded-t-2xl border-t border-border flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {project.url}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* iframe */}
            <div className="flex-1 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}
              {project.url && (
                <iframe
                  src={project.url}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  title={`${project.name} preview`}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop: Side Panel
  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: panelWidth, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-screen bg-background border-l border-border flex flex-col z-50 shadow-2xl"
        style={{ width: panelWidth }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize group hover:bg-accent/50 transition-colors flex items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute -left-3 w-6 h-full" />
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-foreground truncate">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {project.url}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* iframe */}
        <div className="flex-1 relative overflow-hidden">
          {/* 드래그 중 iframe 위에 오버레이 - 마우스 이벤트 가로채기 방지 */}
          {isDragging && (
            <div className="absolute inset-0 z-10 bg-transparent" />
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          )}
          {project.url && (
            <iframe
              src={project.url}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              title={`${project.name} preview`}
            />
          )}
        </div>

        {/* Footer with width indicator */}
        <div className="px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground text-center">
          {Math.round(panelWidth)}px
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
