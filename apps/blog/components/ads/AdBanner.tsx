"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  position?: "top" | "middle" | "bottom";
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({
  slot,
  format = "auto",
  className,
  position = "middle",
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // AdSense가 설정되지 않은 경우 렌더링하지 않음
  if (!clientId) {
    return null;
  }

  return (
    <div
      className={cn(
        "ad-container my-8 flex items-center justify-center",
        position === "top" && "mt-4 mb-8",
        position === "middle" && "my-12",
        position === "bottom" && "mt-8 mb-4",
        className
      )}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
