import { z } from "zod";

export const KPISchema = z.object({
  hourlyOperatoryRate: z.number().min(200).max(500),
  dailyHygieneTarget: z.number().min(2000).max(4000),
  treatmentAcceptance: z.number().min(0).max(1),
  collectionsRatio: z.number().min(0).max(1).optional(),
  patientSatisfaction: z.number().min(1).max(5).optional(),
});

export type OperationalKPIs = z.infer<typeof KPISchema>;
