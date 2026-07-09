import { Button, ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function LoadingButton({
  children,
  isLoading,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("relative transition-all duration-300", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary-foreground" />
      )}
      <span className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </Button>
  )
}
