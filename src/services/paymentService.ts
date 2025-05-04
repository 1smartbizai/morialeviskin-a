
// Mock clients data
export const getMockClients = () => [
  { id: "c1", name: "שרה כהן" },
  { id: "c2", name: "מיכאל לוי" },
  { id: "c3", name: "אמילי כץ" },
  { id: "c4", name: "דוד פרץ" },
  { id: "c5", name: "רותי אברהם" },
];

// Mock treatment types
export const getMockTreatmentTypes = () => [
  "טיפול פנים", 
  "פדיקור", 
  "מניקור", 
  "עיצוב גבות", 
  "טיפול עיניים"
];

// Mock payments data
export const getMockPayments = () => [
  {
    id: "1",
    clientId: "c1",
    clientName: "שרה כהן",
    amount: 450,
    date: "1 ביוני, 2025",
    service: "טיפול פנים",
    status: "completed" as const,
    invoiceId: "inv-123",
  },
  {
    id: "2",
    clientId: "c2",
    clientName: "מיכאל לוי",
    amount: 180,
    date: "28 במאי, 2025",
    service: "פדיקור",
    status: "pending" as const,
  },
  {
    id: "3",
    clientId: "c3",
    clientName: "אמילי כץ",
    amount: 320,
    date: "25 במאי, 2025",
    service: "מניקור",
    status: "overdue" as const,
  },
  {
    id: "4",
    clientId: "c4",
    clientName: "דוד פרץ",
    amount: 550,
    date: "22 במאי, 2025",
    service: "טיפול פנים מלא",
    status: "completed" as const,
    invoiceId: "inv-124",
  },
  {
    id: "5",
    clientId: "c5",
    clientName: "רותי אברהם",
    amount: 250,
    date: "20 במאי, 2025",
    service: "עיצוב גבות",
    status: "pending" as const,
  },
];

// Mock overdue clients
export const getMockOverdueClients = () => [
  {
    id: "c3",
    name: "אמילי כץ",
    balance: 320,
    daysOverdue: 15,
    lastContact: "לפני 5 ימים",
  },
  {
    id: "c6",
    name: "גלית אזולאי",
    balance: 620,
    daysOverdue: 30,
    lastContact: "לפני שבוע",
  },
  {
    id: "c7",
    name: "אבי משה",
    balance: 180,
    daysOverdue: 7,
  },
];

export interface Payment {
  id: string | number;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  service: string;
  status: "completed" | "pending" | "overdue";
  invoiceId?: string;
}

export interface DebtClient {
  id: string;
  name: string;
  balance: number;
  daysOverdue: number;
  lastContact?: string;
}

// Calculate stats from payments
export const calculatePaymentStats = (payments: Payment[]) => {
  const completed = payments.filter(p => p.status === "completed");
  const pending = payments.filter(p => p.status === "pending" || p.status === "overdue");
  
  return {
    totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
    outstandingPayments: pending.reduce((sum, p) => sum + p.amount, 0),
    transactionCount: payments.length,
  };
};
