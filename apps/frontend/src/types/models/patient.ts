export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    insuranceId?: string;
    medicalHistory?: string;
  };