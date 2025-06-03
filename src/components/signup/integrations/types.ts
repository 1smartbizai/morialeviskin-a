
import { LucideIcon } from "lucide-react";
import { FeatureName } from "@/utils/planPermissions";

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  feature: FeatureName;
  enabled: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  connectUrl: string;
  category: string;
}

export interface IntegrationsState {
  googleCalendar: boolean;
  email: boolean;
  whatsapp: boolean;
  instagram: boolean;
  facebook: boolean;
  sms: boolean;
}
