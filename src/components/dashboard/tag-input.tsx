"use client";

import type React from "react";
import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = "Add tag...",
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();

      if (value.length >= maxTags) return;

      // Don't add duplicate tags
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }

      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length >= maxTags ? "Max tags reached" : placeholder}
        disabled={value.length >= maxTags}
        className="border border-gray-200 dark:border-gray-800 dark:bg-gray-800"
      />

      <p className="text-xs text-gray-500">
        Press Enter to add a tag. {value.length}/{maxTags} tags used.
      </p>
    </div>
  );
};
