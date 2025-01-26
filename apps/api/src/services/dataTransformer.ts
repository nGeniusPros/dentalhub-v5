import { Patient, User } from "../types";
import crypto from "crypto";

export function transformPatientData(patient: any): Patient {
  return {
    id: crypto.randomUUID(),
    user_id: null,
    first_name: patient.firstname || "",
    last_name: patient.lastname || "",
    email: patient.email || null,
    phone: patient.cell || null,
    date_of_birth: patient.birthdate?.split("T")[0] || null,
    address: {
      line1: patient.address_line1 || null,
      line2: patient.address_line2 || null,
      city: patient.city || null,
      state: patient.state || null,
      zipcode: patient.zipcode || null,
    },
    medical_history: {
      first_visit_date: patient.first_visit?.split("T")[0] || null,
      last_visit_date: patient.last_visit?.split("T")[0] || null,
      preferred_name: patient.preferred_name || null,
      preferred_contact: patient.preferred_contact || null,
      preferred_communication: patient.preferred_communication_method || null,
      sikka_patient_id: patient.patient_id,
      sikka_practice_id: patient.practice_id,
      sikka_provider_id: patient.provider_id || null,
      sikka_cust_id: patient.cust_id || null,
      insurance: {
        primary_insurance_company_id:
          patient.primary_insurance_company_id || null,
        primary_relationship: patient.primary_relationship || null,
        subscriber_id: patient.subscriber_id || null,
        primary_medical_insurance: patient.primary_medical_insurance || null,
        primary_medical_insurance_id:
          patient.primary_medical_insurance_id || null,
        primary_medical_relationship:
          patient.primary_medical_relationship || null,
        primary_medical_subscriber_id:
          patient.primary_medical_subscriber_id || null,
      },
      referrals: {
        other_referral: patient.other_referral || null,
        patient_referral: patient.patient_referral || null,
      },
    },
  };
}
