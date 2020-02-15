import jwt from 'jsonwebtoken';
import basicAuth from 'express-basic-auth';
import { Request, Response, NextFunction } from 'express';

function basic(username: string, password: string) {
    console.info(`[info] [basic auth] user: ${username}, pass: ${password}`);

    const userMatches = basicAuth.safeCompare(username, "basic");
    const passwordMatches = basicAuth.safeCompare(password, "test");
    return userMatches && passwordMatches;
}

function jwtAuth(req: Request, res: Response, next: NextFunction) {
    const token: string = req.headers.authorization || '';
    
    if (!token) {
        res.status(401).end();
        return;
    }
    console.log(`[jwtAuth] ${token}`);

    // ตรวจสอบ jwt token
    const SECERT = 'myKey';
    let payload: any;
    try {
        payload = jwt.verify(token, SECERT);
        console.log(`[jwtAuth] ${JSON.stringify(payload)}`);
        next();
    } catch (error) {
        res.status(401).end();        
    }
}

/**
 * Ref: https://www.npmjs.com/package/express-basic-auth
 */

export default {
    basic,
    jwtAuth
}