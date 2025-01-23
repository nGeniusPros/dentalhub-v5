import { z } from 'zod';
export declare const KPISchema: z.ZodObject<{
    hourlyOperatoryRate: z.ZodNumber;
    dailyHygieneTarget: z.ZodNumber;
    treatmentAcceptance: z.ZodNumber;
    collectionsRatio: z.ZodOptional<z.ZodNumber>;
    patientSatisfaction: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    hourlyOperatoryRate: number;
    dailyHygieneTarget: number;
    treatmentAcceptance: number;
    patientSatisfaction?: number | undefined;
    collectionsRatio?: number | undefined;
}, {
    hourlyOperatoryRate: number;
    dailyHygieneTarget: number;
    treatmentAcceptance: number;
    patientSatisfaction?: number | undefined;
    collectionsRatio?: number | undefined;
}>;
export type OperationalKPIs = z.infer<typeof KPISchema>;
