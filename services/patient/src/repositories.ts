import type { Patient } from "@dentalhub/database";

export interface PatientRepository {
  create(
    data: Omit<Patient, "id" | "createdAt" | "updatedAt">,
  ): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  update(id: string, data: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<void>;
}
