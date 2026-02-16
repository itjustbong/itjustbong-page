import { Github, Linkedin, type LucideIcon } from "lucide-react";
import {
  developerSites as baseDeveloperSites,
  platformLinks as basePlatformLinks,
  socialLinks as baseSocialLinks,
  type HubLink,
} from "./site-links";

// 개발자가 만든 사이트/프로젝트
export interface DeveloperSite extends HubLink {}

export const developerSites: DeveloperSite[] = baseDeveloperSites;

export const platformLinks: DeveloperSite[] = basePlatformLinks;

// 소셜 링크 정보
export interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
  label: string;
}

const socialIconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
};

export const socialLinks: SocialLink[] = baseSocialLinks.map((link) => ({
  name: link.name,
  url: link.url,
  icon: socialIconMap[link.iconKey] ?? Github,
  label: link.label,
}));
