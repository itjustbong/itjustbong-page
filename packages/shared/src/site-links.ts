export interface HubLink {
  name: string;
  url: string;
  description?: string;
}

export interface HubSocialLink extends HubLink {
  iconKey: "github" | "linkedin";
  label: string;
}

export const developerSites: HubLink[] = [
  {
    name: "Lemme Blind Date",
    url: "https://lemmeblind.date",
    description: "친구소개 플랫폼",
  },
  {
    name: "What's in whale's wallet?",
    url: "https://whales-wallet.com/",
    description: "고래 지갑 추적 서비스",
  },
  {
    name: "Pickiverse",
    url: "https://www.pickiverse.com/",
    description: "피키버스 서비스",
  }
];

export const platformLinks: HubLink[] = [
  {
    name: "테크 블로그",
    url: "https://log.itjustbong.com/",
    description: "MDX 기반 기술 블로그",
  },
  {
    name: "RAG 기반 질의응답",
    url: "https://chat.itjustbong.com/",
    description: "블로그/이력서 기반 AI Q&A",
  },
  {
    name: "이력서",
    url: "https://resume.itjustbong.com/",
    description: "인터랙티브 웹 이력서",
  },
];

export const socialLinks: HubSocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/itjustbong",
    iconKey: "github",
    label: "GitHub",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/%EC%8A%B9%EC%9A%B0-%EB%B4%89-19108514a/",
    iconKey: "linkedin",
    label: "LinkedIn",
  },
];
