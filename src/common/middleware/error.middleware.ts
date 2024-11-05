import { Request, Response, NextFunction } from 'express';
import logger from '../logger.ts';

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
    const isProduction = process.env.NODE_ENV === 'production';

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const statusCode = (error as any).statusCode || 500;

    logger.error('Error occurred: %o', error);

    res.status(statusCode).json({
        error: errorMessage,
        ...(error instanceof Error && !isProduction && { stack: error.stack })
    });
}
