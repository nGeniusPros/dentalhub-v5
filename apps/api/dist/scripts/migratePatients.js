import { createClient } from '@supabase/supabase-js';
import { sikkaConfig } from '../integrations/sikka/config.js';
import SikkaTokenService from '../integrations/sikka/token-service.js';
import { handleSikkaError } from '../integrations/sikka/error.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// Validate required environment variables
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SIKKA_APP_ID',
    'SIKKA_APP_KEY',
    'SIKKA_PRACTICE_ID',
    'SIKKA_P1_PRACTICE_KEY',
    'SIKKA_MAX_RETRY_ATTEMPTS',
    'SIKKA_TOKEN_REFRESH_THRESHOLD',
    'SIKKA_RATE_LIMIT_DELAY'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set in environment variables`);
        process.exit(1);
    }
}
// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Initialize Sikka token service
const tokenService = new SikkaTokenService({
    baseUrl: sikkaConfig.baseUrl,
    appId: process.env.SIKKA_APP_ID,
    appKey: process.env.SIKKA_APP_KEY,
    practiceId: process.env.SIKKA_PRACTICE_ID,
    practiceKey: process.env.SIKKA_P1_PRACTICE_KEY,
    maxRetryAttempts: Number(process.env.SIKKA_MAX_RETRY_ATTEMPTS) || 3,
    tokenRefreshThreshold: Number(process.env.SIKKA_TOKEN_REFRESH_THRESHOLD) || 5,
    rateLimitDelay: Number(process.env.SIKKA_RATE_LIMIT_DELAY) || 5000
});
async function migratePatients() {
    try {
        console.log('Starting patient migration from Sikka...');
        // Get a request key
        const requestKey = await tokenService.getAccessToken();
        console.log('Successfully obtained Sikka request key');
        let offset = 0;
        const limit = 100;
        let hasMore = true;
        let totalMigrated = 0;
        while (hasMore) {
            try {
                const response = await axios.get(`${sikkaConfig.baseUrl}/patients?practice_id=${process.env.SIKKA_PRACTICE_ID}&offset=${offset}&limit=${limit}`, {
                    headers: {
                        'request-key': requestKey,
                        'Content-Type': 'application/json'
                    }
                });
                const patients = response.data?.data?.items || [];
                if (patients.length === 0) {
                    hasMore = false;
                    continue;
                }
                // Process patients in batches
                await Promise.all(patients.map(async (patient) => {
                    try {
                        const { data: existingPatient } = await supabase
                            .from('patients')
                            .select('id')
                            .eq('sikkaPatientId', patient.patient_id)
                            .single();
                        const patientData = {
                            sikkaPatientId: patient.patient_id,
                            firstName: patient.firstname,
                            lastName: patient.lastname,
                            email: patient.email,
                            phone: patient.phone,
                            dateOfBirth: patient.date_of_birth,
                            address: patient.address,
                            city: patient.city,
                            state: patient.state,
                            zipCode: patient.zip,
                            gender: patient.gender,
                            lastSyncedAt: new Date().toISOString()
                        };
                        if (existingPatient) {
                            await supabase
                                .from('patients')
                                .update(patientData)
                                .eq('sikkaPatientId', patient.patient_id);
                        }
                        else {
                            await supabase
                                .from('patients')
                                .insert(patientData);
                        }
                    }
                    catch (error) {
                        console.error(`Failed to process patient ${patient.patient_id}:`, error);
                    }
                }));
                totalMigrated += patients.length;
                console.log(`Migrated ${totalMigrated} patients so far...`);
                offset += limit;
            }
            catch (error) {
                throw handleSikkaError(error);
            }
        }
        console.log(`Patient migration completed. Total patients migrated: ${totalMigrated}`);
    }
    catch (error) {
        console.error('Error migrating patients:', error);
        process.exit(1);
    }
}
// Run the migration
migratePatients()
    .catch(console.error)
    .finally(async () => {
    await supabase.$disconnect();
    process.exit();
});
//# sourceMappingURL=migratePatients.js.map