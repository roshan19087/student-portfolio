import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

type SupportedZodSchema = AnyZodObject | ZodEffects<AnyZodObject>;

export const validateBody = (schema: SupportedZodSchema): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: SupportedZodSchema): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      (req as unknown as { query: unknown }).query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: SupportedZodSchema): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = (await schema.parseAsync(req.params)) as Record<string, string>;
      next();
    } catch (error) {
      next(error);
    }
  };
};
