import { Request, Response, NextFunction } from "express";

/**
 * Validation middleware for request data
 */
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Add validation logic here if needed (e.g., using Joi, Zod)
    next();
  };
};
