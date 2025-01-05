export type Appointment = {
    id: string;
    patientId: string;
    staffId: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
    status: string;
  };