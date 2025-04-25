// components/ui/spinner.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn utility for classNames

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", className)}
      style={{ height: size, width: size }}
    />
  );
}
