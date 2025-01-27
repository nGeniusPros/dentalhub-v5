import { Router, Request, Response } from "express";
import { getRequestKey, getPaginatedData } from "../services/sikkaApi";
import { transformPatientData } from "../services/dataTransformer";
import { PatientService } from "../services/patientService";
import { supabase } from "../utils/supabase";
import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ValidationError, InfrastructureError } from "../errors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env file
dotenv.config({
  path: path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "apps",
    "frontend",
    ".env",
  ),
});

const router = Router();

const envSchema = z.object({
  SIKKA_APP_ID: z.string(),
  SIKKA_APP_KEY: z.string(),
  SIKKA_P1_MASTER_CUSTOMER_ID: z.string(),
  SIKKA_P1_PRACTICE_ID: z.string(),
  SIKKA_P1_PRACTICE_KEY: z.string(),
});

interface SikkaPatient {
  patient_id: string;
  firstname: string;
  lastname: string;
  email?: string;
  birthdate?: string;
  status?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  cell?: string;
  first_visit?: string;
  last_visit?: string;
  preferred_name?: string;
  preferred_contact?: string;
  preferred_communication_method?: string;
  cust_id?: string;
  provider_id?: string;
  guarantor_id?: string;
  primary_insurance_company_id?: string;
  primary_relationship?: string;
  subscriber_id?: string;
  primary_medical_insurance?: string;
  primary_medical_insurance_id?: string;
  primary_medical_relationship?: string;
  primary_medical_subscriber_id?: string;
  other_referral?: string;
  patient_referral?: string;
}

interface ApiResponse<T = unknown> {
  message?: string;
  error?: string | z.ZodError | unknown;
  results?: T;
}

const getPatientsHandler = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const patientService = new PatientService(supabase);
    const { error } = await patientService.syncPatientsFromSikka();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ message: "Patients data synced successfully" });
  } catch (error) {
    console.error("Error syncing patients from Sikka:", error);
    return res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
  }
};

const searchSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  lastVisitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .optional(),
});

type SearchCriteria = z.infer<typeof searchSchema>;

const searchPatientsHandler = async (
  req: Request,
  res: Response<ApiResponse>,
) => {
  try {
    const criteria = searchSchema.parse(req.body);
    const results = await PatientService.searchPatients(criteria);

    return res.status(200).json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Patient search failed:", error);
    return res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : "Failed to search patients",
      });
  }
};

router.get("/", getPatientsHandler);
router.post("/search", searchPatientsHandler);

export default router;
