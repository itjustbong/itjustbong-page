import { Github, Linkedin, type LucideIcon } from "lucide-react";

// 개발자가 만든 사이트/프로젝트
export interface DeveloperSite {
  name: string;
  url: string;
  description?: string;
}

export const developerSites: DeveloperSite[] = [
  {
    name: "피키버스",
    url: "https://www.pickiverse.com/",
    description: "피키버스 서비스",
  },
  {
    name: "What's in whale's wallet?",
    url: "https://whales-wallet.com/",
    description: "고래 지갑 추적 서비스",
  },
];

// 소셜 링크 정보
export interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/itjustbong",
    icon: Github,
    label: "GitHub",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/%EC%8A%B9%EC%9A%B0-%EB%B4%89-19108514a/",
    icon: Linkedin,
    label: "LinkedIn",
  },
];
