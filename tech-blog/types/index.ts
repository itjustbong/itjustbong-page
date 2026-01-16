export type Category = "frontend" | "backend" | "docker" | "blockchain" | "ai";

export const CATEGORIES: Category[] = [
  "frontend",
  "backend",
  "docker",
  "blockchain",
  "ai",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  docker: "도커",
  blockchain: "블록체인",
  ai: "AI",
};

export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface Draft {
  id: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  thumbnail?: string;
  savedAt: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt?: string;
  published?: boolean;
}
