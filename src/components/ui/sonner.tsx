
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      dir="rtl"
      position="top-left"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:dir-rtl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        duration: 5000,
      }}
      {...props}
    />
  )
}

// Type extensions for toast to add success and other variants
const extendedToast = {
  ...toast,
  success: (title: string, options?: any) => toast.success(title, options),
  warning: (title: string, options?: any) => toast.warning(title, options),
  info: (title: string, options?: any) => toast.info(title, options),
  error: (title: string, options?: any) => toast.error(title, options),
}

export { Toaster, extendedToast as toast }
