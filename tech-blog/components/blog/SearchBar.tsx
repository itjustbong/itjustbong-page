"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "검색어를 입력하세요...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-2xl">
      <div
        className={`from-primary/20 via-primary/10 to-primary/20 absolute -inset-0.5 rounded-lg bg-linear-to-r opacity-0 blur transition-opacity duration-300 ${
          isFocused ? "opacity-100" : ""
        }`}
      />
      <div className="relative">
        <Search
          className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
            isFocused ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <Input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-10 transition-all duration-300"
        />
      </div>
    </div>
  );
}
