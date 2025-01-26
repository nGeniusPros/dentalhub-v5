import { z } from 'zod';

// Common validation schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Insurance validation schemas
export const insurancePlanSchema = z.object({
  name: z.string().min(1),
  providerId: z.string().min(1),
  planType: z.enum(['PPO', 'HMO', 'EPO', 'Indemnity', 'Medicare', 'Medicaid']),
  groupNumber: z.string().optional(),
  planNumber: z.string().optional(),
  deductible: z.object({
    individual: z.number().min(0),
    family: z.number().min(0),
    preventive: z.boolean(),
  }),
  maximumBenefit: z.object({
    annual: z.number().min(0),
    lifetime: z.number().min(0),
    preventive: z.boolean(),
  }),
  preAuthorizationRequired: z.boolean(),
  preAuthorizationThreshold: z.number().min(0).optional(),
});

export const insuranceSearchSchema = paginationSchema.extend({
  search: z.string().optional(),
  provider: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

// Procedure code validation schemas
export const procedureCodeSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  category: z.string().min(1),
  type: z.enum([
    'diagnostic',
    'preventive',
    'restorative',
    'endodontics',
    'periodontics',
    'prosthodontics',
    'oral-surgery',
    'orthodontics',
  ]),
  status: z.enum(['active', 'inactive', 'deprecated']),
  requiresTooth: z.boolean(),
  requiresSurface: z.boolean(),
  requiresQuadrant: z.boolean(),
  defaultFee: z.number().min(0),
  ucr: z.number().min(0),
  metadata: z.object({
    ada: z.string().optional(),
    icd: z.array(z.string()).optional(),
    cdt: z.string().optional(),
    modifiers: z.array(z.string()).optional(),
    aliases: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
});

export const procedureSearchSchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'inactive', 'deprecated']).optional(),
});

// Error handling utilities
export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

export const validate = <T>(schema: z.Schema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
};

// Type inference helpers
export type InsurancePlan = z.infer<typeof insurancePlanSchema>;
export type ProcedureCode = z.infer<typeof procedureCodeSchema>;
export type SearchParams = z.infer<typeof paginationSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
