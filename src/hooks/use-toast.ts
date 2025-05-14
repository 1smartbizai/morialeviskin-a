
import { toast as sonnerToast, type ToastT } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: ToastProps) {
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      duration,
    });
  }

  return sonnerToast(title, {
    description,
    duration,
  });
}

// Provide the original sonner toast for more complex toast usage
export { sonnerToast as toast };

// Re-export for compatibility with components/ui/use-toast
export const useToast = () => {
  return {
    toast,
  };
};
