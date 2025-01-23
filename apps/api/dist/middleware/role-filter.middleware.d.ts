import { RequestHandler } from 'express';
import { UserRole } from '../types';
export declare const roleBasedKPIFilter: (roles: UserRole[]) => RequestHandler;
