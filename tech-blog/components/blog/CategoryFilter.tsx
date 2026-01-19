"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Category, CATEGORIES, CATEGORY_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories?: Category[];
  selected?: Category | null;
  selectedCategory?: Category;
  onSelect?: (category: Category | null) => void;
}

const categoryColors: Record<Category, string> = {
  frontend: "text-frontend",
  backend: "text-backend",
  docker: "text-docker",
  blockchain: "text-blockchain",
  ai: "text-ai",
};

export function CategoryFilter({
  categories = CATEGORIES,
  selected,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  // 링크 기반 모드 (selectedCategory가 있으면)
  const isLinkMode = selectedCategory !== undefined || !onSelect;
  const activeCategory = selectedCategory ?? selected;

  if (isLinkMode) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 pb-2 md:justify-center">
          <Button
            variant={!activeCategory ? "default" : "outline"}
            size="sm"
            asChild
            className="shrink-0"
          >
            <Link href="/">전체</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              asChild
              className={cn(
                "shrink-0",
                activeCategory === category && categoryColors[category]
              )}
            >
              <Link href={`/category/${category}`}>
                {CATEGORY_LABELS[category]}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // 콜백 기반 모드
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 pb-2 md:justify-center">
        <Button
          variant={selected === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect?.(null)}
          className="shrink-0"
        >
          전체
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selected === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect?.(category)}
            className={cn(
              "shrink-0",
              selected === category && categoryColors[category]
            )}
          >
            {CATEGORY_LABELS[category]}
          </Button>
        ))}
      </div>
    </div>
  );
}
