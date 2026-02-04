"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePdf } from "@/lib/pdf-generator";

interface PdfDownloadButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  filename?: string;
}

export function PdfDownloadButton({
  targetRef,
  filename = "봉승우_이력서.pdf",
}: PdfDownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleDownload = useCallback(async () => {
    if (!targetRef.current || status === "loading") return;

    setStatus("loading");

    try {
      await generatePdf(targetRef.current, {
        filename,
        scale: 2,
        margin: 5,
      });

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setStatus("idle");
    }
  }, [targetRef, filename, status]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 print:hidden"
    >
      <Button
        onClick={handleDownload}
        disabled={status === "loading"}
        size="lg"
        className="h-14 px-6 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:shadow-xl"
      >
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">생성 중...</span>
            </motion.span>
          )}
          {status === "success" && (
            <motion.span
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span className="hidden sm:inline">완료!</span>
            </motion.span>
          )}
          {status === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              <span className="hidden sm:inline">PDF 다운로드</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
