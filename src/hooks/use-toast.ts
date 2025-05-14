
import { toast as sonnerToast, type ToastT } from "sonner";

export interface ToastProps {
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

export const useToast = () => {
  return {
    toast,
    // This is needed for compatibility with the toaster.tsx component
    toasts: [] as any[],
  };
};
