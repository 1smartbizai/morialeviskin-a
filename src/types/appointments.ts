
export interface Appointment {
  id: string;
  client_id: string;
  treatment_id?: string;
  treatment_name: string; 
  appointment_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}
