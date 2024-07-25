import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers.authorization;
    if (token) {
        token = token.split(' ')[1];

        try {
            jwt.verify(token, process.env.SECRET_KEY_TOKEN as string);
            next();
        } catch (err) {
            res.status(401).json({
                error: "Unauthorized token",
            });
        }
    } else {
        res.status(401).json({
            error: "Missing Header Authorization",
        });
    }
};

export default authenticationMiddleware;
