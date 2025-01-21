export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  insurance: string;
  medicalHistory: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  insurance?: string;
}

export interface PatientCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  insurance: string;
  medicalHistory?: string;
  notes?: string;
}

export interface PatientUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  insurance?: string;
  medicalHistory?: string;
  notes?: string;
}