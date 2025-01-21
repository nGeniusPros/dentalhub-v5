export interface User {
  id: string;
  email: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  salutation: string | null;
  phone_number: string | null;
}

export interface Patient {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
  };
  medical_history: {
    first_visit_date: string | null;
    last_visit_date: string | null;
    preferred_name: string | null;
    preferred_contact: string | null;
    preferred_communication: string | null;
    sikka_patient_id: string;
    sikka_practice_id: string;
    sikka_provider_id: string | null;
    sikka_cust_id: string | null;
    insurance: {
      primary_insurance_company_id: string | null;
      primary_relationship: string | null;
      subscriber_id: string | null;
      primary_medical_insurance: string | null;
      primary_medical_insurance_id: string | null;
      primary_medical_relationship: string | null;
      primary_medical_subscriber_id: string | null;
    };
    referrals: {
      other_referral: string | null;
      patient_referral: string | null;
    };
  };
}

export interface NotificationConfig {
  emailProvider: string;
  smsProvider: string;
}