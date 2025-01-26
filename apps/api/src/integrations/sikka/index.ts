import { Router, Request, Response } from 'express';
import { verifyInsurance, checkEligibility, verifyBenefits, processClaim } from './service';
import { validateInsuranceRequest, validateEligibilityRequest, validateBenefitsRequest, validateClaimRequest } from './validators';
import { handleError } from '../../utils/errorHandler';
import { z } from 'zod';

const router = Router();

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string | z.ZodError | unknown;
}

// Insurance verification endpoint
router.post('/verify', validateInsuranceRequest, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await verifyInsurance(req.body);
    return res.json({ data: result });
  } catch (error) {
    handleError(error, res);
  }
});

// Eligibility check endpoint
router.post('/eligibility', validateEligibilityRequest, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await checkEligibility(req.body);
    return res.json({ data: result });
  } catch (error) {
    handleError(error, res);
  }
});

// Benefits verification endpoint
router.post('/benefits', validateBenefitsRequest, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await verifyBenefits(req.body);
    return res.json({ data: result });
  } catch (error) {
    handleError(error, res);
  }
});

// Claims processing endpoint
router.post('/claims', validateClaimRequest, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await processClaim(req.body);
    return res.json({ data: result });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;