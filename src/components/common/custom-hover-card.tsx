import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { ReactElement, ReactNode } from "react";

interface CustomHoverCardProps {
  trigger: ReactElement;
  children: ReactNode;
  delay?: number;
  closeDelay?: number;
  className?: string;
}

export function CustomHoverCard({
  trigger,
  children,
  delay = 10,
  closeDelay = 100,
  className = "w-64 bg-white",
}: CustomHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={delay}
        closeDelay={closeDelay}
        render={trigger}
      />

      <HoverCardContent className={className}>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

