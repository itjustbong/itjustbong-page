"use client";

import BlurText from "@/components/reactbits/BlurText";
import Aurora from "@/components/reactbits/Aurora";

export function Hero() {
  return (
    <section className="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      {/* Aurora 배경 효과 - 절제된 사용 */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <Aurora
          colorStops={["#E0E7FF", "#DBEAFE", "#E0F2FE", "#E0E7FF"]}
          speed={2}
          blur={120}
        />
      </div>

      {/* 메인 타이틀 */}
      <div className="text-center">
        <BlurText
          text="기술의 깊이를 탐구합니다"
          delay={100}
          animateBy="words"
          className="text-foreground text-3xl font-bold tracking-tight md:text-5xl"
          animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
          animationTo={[
            { filter: "blur(5px)", opacity: 0.5, y: 5 },
            { filter: "blur(0px)", opacity: 1, y: 0 },
          ]}
          onAnimationComplete={() => {}}
        />
      </div>

      {/* 서브 타이틀 */}
      <p className="text-muted-foreground mt-6 max-w-2xl text-center text-base md:text-lg">
        프론트엔드, 백엔드, 도커, 블록체인, AI 등 다양한 기술 콘텐츠를
        만나보세요
      </p>
    </section>
  );
}
