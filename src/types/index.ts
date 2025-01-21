export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'patient';
  email: string;
  title?: string;
  department?: string;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  group?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  provider?: string;
}

export interface Treatment {
  id: string;
  type: string;
  tooth?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  insuranceCoverage: number;
  recommendedDate: string;
  status: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dob: string;
  nextAppointment?: string;
  insurance?: string;
  status: 'active' | 'inactive';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  category: string;
}