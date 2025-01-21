import express from 'express';
import { verifyInsurance, checkEligibility, verifyBenefits, processClaim } from './service';
import { validateInsuranceRequest, validateEligibilityRequest, validateBenefitsRequest, validateClaimRequest } from './validators';
import { handleError } from '../../utils/errorHandler';
const router = express.Router();
// Insurance verification endpoint
router.post('/verify', validateInsuranceRequest, async (req, res) => {
    try {
        const result = await verifyInsurance(req.body);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Eligibility check endpoint
router.post('/eligibility', validateEligibilityRequest, async (req, res) => {
    try {
        const result = await checkEligibility(req.body);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Benefits verification endpoint
router.post('/benefits', validateBenefitsRequest, async (req, res) => {
    try {
        const result = await verifyBenefits(req.body);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Claims processing endpoint
router.post('/claims', validateClaimRequest, async (req, res) => {
    try {
        const result = await processClaim(req.body);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
export default router;
