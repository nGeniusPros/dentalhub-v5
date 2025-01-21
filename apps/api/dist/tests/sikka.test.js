import { verifyInsurance, checkEligibility, verifyBenefits, processClaim } from '../integrations/sikka/service';
describe('Sikka Integration', () => {
    it('should verify insurance successfully', async () => {
        const data = {
            patientId: 'patient-id-1',
            insuranceInfo: {
                carrierId: 'carrier-id-1',
                memberId: 'member-id-1',
            },
        };
        const result = await verifyInsurance(data);
        expect(result).toBeDefined();
        expect(result.verified).toBeDefined();
    });
    it('should check eligibility successfully', async () => {
        const data = {
            patientId: 'patient-id-1',
            serviceDate: '2024-03-15',
            serviceTypes: ['cleaning', 'exam'],
        };
        const result = await checkEligibility(data);
        expect(result).toBeDefined();
        expect(result.eligible).toBeDefined();
    });
    it('should verify benefits successfully', async () => {
        const data = {
            patientId: 'patient-id-1',
            procedureCodes: ['D0150', 'D1110'],
            serviceDate: '2024-03-15',
        };
        const result = await verifyBenefits(data);
        expect(result).toBeDefined();
        expect(result.covered).toBeDefined();
    });
    it('should process a claim successfully', async () => {
        const data = {
            patientId: 'patient-id-1',
            claimDetails: {
                serviceDate: '2024-03-15',
                procedures: [
                    { code: 'D0150', fee: 50, diagnosis: ['K05.3'] },
                    { code: 'D1110', fee: 100, diagnosis: ['K05.3'] },
                ],
                diagnosisCodes: ['K05.3'],
                placeOfService: 'office',
            },
        };
        const result = await processClaim(data);
        expect(result).toBeDefined();
        expect(result.claimId).toBeDefined();
    });
});
