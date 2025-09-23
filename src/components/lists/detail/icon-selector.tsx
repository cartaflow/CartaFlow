"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICON_OPTIONS } from "@/lib/icons";

interface IconSelectorProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
}

export default function IconSelector({ selectedIcon, onIconChange }: IconSelectorProps) {
  return (
    <div className="grid xl:grid-cols-15 grid-cols-8 gap-2">
      {ICON_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedIcon === option.value;

        return (
          <Button key={option.value} variant={isSelected ? "default" : "outline"} className={cn("h-auto aspect-square cursor-pointer", isSelected && "ring-2 ring-primary ring-offset-2")} onClick={() => onIconChange(option.value)} type="button">
            <Icon className="size-6" />
          </Button>
        );
      })}
    </div>
  );
}
