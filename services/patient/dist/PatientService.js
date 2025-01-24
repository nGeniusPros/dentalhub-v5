import { z } from 'zod';
import { PatientError } from './errors';
const PatientCreateSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.date(),
    insuranceId: z.string().uuid().optional(),
    practiceId: z.string().uuid().optional() // Or make it required based on your needs
});
export class PatientService {
    constructor(repository, audit) {
        this.repository = repository;
        this.audit = audit;
    }
    async createPatient(params) {
        const parsed = PatientCreateSchema.safeParse(params);
        if (!parsed.success) {
            throw new PatientError('Invalid patient data', 'VALIDATION_ERROR', parsed.error.errors);
        }
        try {
            // Ensure practiceId is available, you might need to adjust how practiceId is obtained
            const practiceId = 'default-practice-id'; // Replace with actual practice ID logic
            const patientData = {
                ...parsed.data,
                practiceId, // Add practiceId
            };
            const patient = await this.repository.create(patientData);
            await this.audit.log('PATIENT_CREATED', patient.id);
            return patient;
        }
        catch (error) {
            throw new PatientError('Failed to create patient', 'DATABASE_ERROR', error);
        }
    }
}
