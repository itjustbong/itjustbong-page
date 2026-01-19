"use client";

import { Hero } from "@/components/blog/Hero";
import { SearchBar } from "@/components/blog/SearchBar";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostList } from "@/components/blog/PostList";
import { Category, PostMeta } from "@/types";
import { useEffect, useState } from "react";

const CATEGORIES: Category[] = [
  "frontend",
  "backend",
  "docker",
  "blockchain",
  "ai",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
          setFilteredPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = [...posts];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const descriptionMatch = post.description.toLowerCase().includes(query);
        const tagsMatch = post.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return titleMatch || descriptionMatch || tagsMatch;
      });
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Search and Filter Section */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="검색어를 입력하세요..."
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Post List Section */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>
    </div>
  );
}
