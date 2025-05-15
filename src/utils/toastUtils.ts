
import { toast } from "@/hooks/use-toast";

export const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
  toast({
    title: type === "success" ? "Success" : type === "error" ? "Error" : "Information",
    description: message,
    variant: type === "error" ? "destructive" : "default",
  });
};
