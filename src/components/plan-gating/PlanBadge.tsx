
import React from "react";
import { Badge } from "@/components/ui/badge";
import { type PlanType, PLAN_INFO } from "@/utils/planPermissions";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: PlanType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  showName?: boolean;
}

const PlanBadge = ({ 
  plan, 
  size = 'md', 
  className,
  showIcon = true,
  showName = true
}: PlanBadgeProps) => {
  const planInfo = PLAN_INFO[plan];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5', 
    lg: 'text-base px-4 py-2'
  };
  
  return (
    <Badge 
      className={cn(
        sizeClasses[size],
        "font-medium border-0 text-white shadow-sm",
        className
      )}
      style={{ backgroundColor: planInfo.color }}
    >
      {showIcon && <span className="ml-1">{planInfo.icon}</span>}
      {showName && planInfo.name}
    </Badge>
  );
};

export default PlanBadge;
