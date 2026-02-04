"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Sparkles } from "lucide-react";

interface FeatureNotificationProps {
  /** 노티피케이션 표시 시간 (ms) */
  displayDuration?: number;
  /** 페이드아웃 애니메이션 시간 (ms) */
  fadeOutDuration?: number;
}

export function FeatureNotification({
  displayDuration = 3000,
  fadeOutDuration = 500,
}: FeatureNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 약간의 딜레이 후 표시
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (isVisible && !isDragging) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, displayDuration);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, isDragging, displayDuration]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // 아래로 30px 이상 드래그하면 닫기
    if (info.offset.y > 30) {
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ 
            duration: fadeOutDuration / 1000,
            ease: "easeOut"
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.3}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="rounded-t-full fixed bottom-0 left-0 right-0 z-50 cursor-grab active:cursor-grabbing select-none print:hidden"
        >
          {/* 타원형 그라데이션 배경 - 하단 투명, 상단 중앙으로 갈수록 불투명 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, 
                var(--notification-bg) 0%, 
                var(--notification-bg) 30%,
                var(--notification-bg-light) 60%, 
                transparent 100%)`,
            }}
          />
          
          {/* 콘텐츠 */}
          <div className="relative flex flex-col items-center justify-center pt-8 pb-10 px-4">
            {/* 드래그 힌트 바 */}
            <div className="w-10 h-1 rounded-full bg-foreground/20 mb-4" />
            
            <div className="flex items-center gap-2 text-center">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <p className="text-sm text-foreground font-medium">
                프로젝트 이름에 마우스를 올리면 미리보기를, 클릭하면 상세 정보를 볼 수 있어요
              </p>
            </div>
          </div>

          <style jsx>{`
            :global(:root) {
              --notification-bg: rgba(255, 255, 255, 1);
              --notification-bg-light: rgba(255, 255, 255, 0.8);
            }
            :global(.dark) {
              --notification-bg: rgba(20, 20, 20, 1);
              --notification-bg-light: rgba(20, 20, 20, 0.8);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
