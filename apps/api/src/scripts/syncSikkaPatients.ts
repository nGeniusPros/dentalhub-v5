import { createClient } from '@supabase/supabase-js';
import { PatientService } from '../services/patientService';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SIKKA_APP_KEY',
  'SIKKA_PRACTICE_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not set in environment variables`);
    process.exit(1);
  }
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize PatientService
const patientService = new PatientService(supabase);

async function syncPatients() {
  try {
    console.log('Starting patient sync from Sikka...');
    const result = await patientService.syncPatientsFromSikka();
    console.log('Patient sync completed:', result);
  } catch (error) {
    console.error('Error syncing patients:', error);
    process.exit(1);
  }
}

// Run the sync
syncPatients();
