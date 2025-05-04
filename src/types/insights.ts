
export type InsightType = "appointment" | "client" | "revenue" | "marketing";
export type InsightPriority = "high" | "medium" | "low";

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  priority: InsightPriority;
  actionText: string;
  actionLink?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface InsightsStats {
  weeklyAppointments: number;
  weeklyAppointmentsChange: number;
  activeClients: number;
  activeClientsChange: number;
  weeklyRevenue: number;
  weeklyRevenueChange: number;
}
