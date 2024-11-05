import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: errorMessage });
}
