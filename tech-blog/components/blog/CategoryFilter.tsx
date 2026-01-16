"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

const categoryLabels: Record<Category, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  docker: "도커",
  blockchain: "블록체인",
  ai: "AI",
};

const categoryColors: Record<Category, string> = {
  frontend: "text-frontend",
  backend: "text-backend",
  docker: "text-docker",
  blockchain: "text-blockchain",
  ai: "text-ai",
};

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 pb-2 md:justify-center">
        <Button
          variant={selected === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(null)}
          className="shrink-0"
        >
          전체
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selected === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(category)}
            className={cn(
              "shrink-0",
              selected === category && categoryColors[category]
            )}
          >
            {categoryLabels[category]}
          </Button>
        ))}
      </div>
    </div>
  );
}
