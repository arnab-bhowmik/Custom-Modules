import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    // To display details for any unhandled error
    console.error(err);
    res.status(400).send({ errors: [{ message: 'Unhandled Error!' }] });

};