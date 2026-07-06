import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IconActionButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
  icon: LucideIcon;
}

export function IconActionButton({
  label,
  icon: Icon,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: IconActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant={variant} size={size} aria-label={label} {...props} />}>
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
