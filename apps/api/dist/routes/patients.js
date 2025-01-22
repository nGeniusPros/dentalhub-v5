import { Router } from 'express';
import { getRequestKey, getPaginatedData } from '../services/sikkaApi';
import { transformPatientData } from '../services/dataTransformer';
import { supabase } from '../utils/supabase.js';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from frontend .env file
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', 'apps', 'frontend', '.env') });
const router = Router();
const envSchema = z.object({
    SIKKA_APP_ID: z.string(),
    SIKKA_APP_KEY: z.string(),
    SIKKA_P1_MASTER_CUSTOMER_ID: z.string(),
    SIKKA_P1_PRACTICE_ID: z.string(),
    SIKKA_P1_PRACTICE_KEY: z.string(),
});
const getPatientsHandler = async (req, res) => {
    try {
        const env = envSchema.parse(process.env);
        const requestKey = await getRequestKey(env.SIKKA_APP_ID, env.SIKKA_APP_KEY, env.SIKKA_P1_MASTER_CUSTOMER_ID, env.SIKKA_P1_PRACTICE_KEY);
        console.log('Got request key:', requestKey);
        const patients = await getPaginatedData(requestKey, env.SIKKA_P1_PRACTICE_ID, 'patients', 'patient_id,firstname,lastname,email,birthdate,status,address_line1,address_line2,city,state,zipcode,cell,first_visit,last_visit,preferred_name,preferred_contact,preferred_communication_method,cust_id,provider_id,guarantor_id,primary_insurance_company_id,primary_relationship,subscriber_id,primary_medical_insurance,primary_medical_insurance_id,primary_medical_relationship,primary_medical_subscriber_id,other_referral,patient_referral');
        console.log('Got patients from Sikka:', patients.length);
        console.log('First patient:', patients[0]);
        const transformedPatients = patients.map(transformPatientData);
        console.log('Transformed first patient:', transformedPatients[0]);
        // Try inserting one patient at a time
        for (const patient of transformedPatients) {
            try {
                const { error } = await supabase.from('patients').insert([patient]);
                if (error) {
                    console.error('Error inserting patient:', patient.id);
                    console.error('Error details:', error);
                    console.error('Error message:', error.message);
                    console.error('Error details:', error.details);
                    console.error('Error hint:', error.hint);
                }
            }
            catch (error) {
                console.error('Exception inserting patient:', patient.id, error);
            }
        }
        res.json({ message: 'Patients data synced successfully' });
        return;
    }
    catch (error) {
        console.error('Error fetching or inserting patients:', error);
        res.status(500).json({ error: error.message });
        return;
    }
};
router.get('/', getPatientsHandler);
export default router;
