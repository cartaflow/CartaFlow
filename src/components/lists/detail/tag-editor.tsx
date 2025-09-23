"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagEditorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagEditor({ tags, onTagsChange }: TagEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full pr-1 flex items-center gap-1"
            >
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag)}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add New Tag */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={addTag}
          disabled={!inputValue.trim() || tags.includes(inputValue.trim())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}