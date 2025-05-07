
export interface TreatmentHistoryItem {
  id: string;
  treatmentName: string;
  appointmentDate: Date;
  appointmentStatus: string;
  businessOwnerName?: string;
  therapistNotes?: string | null;
  price: number;
  attachments: {
    name: string;
    type: string;
    url: string;
  }[];
}

export interface TreatmentFilter {
  treatmentId?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
}
