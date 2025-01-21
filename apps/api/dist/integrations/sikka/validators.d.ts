import { Request, Response, NextFunction } from 'express';
export declare const validateInsuranceRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateEligibilityRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateBenefitsRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateClaimRequest: (req: Request, res: Response, next: NextFunction) => void;
