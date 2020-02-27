import jwt from 'jsonwebtoken';
import basicAuth from 'express-basic-auth';
import { Request, Response, NextFunction } from 'express';

import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';

const SECERT = 'myKey';

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
    console.log(`[jwtAuth] token: ${token}`);

    // ตรวจสอบ jwt token
    let payload: any;
    try {
        payload = jwt.verify(token, SECERT);
        console.log(`[jwtAuth] payload: ${JSON.stringify(payload)}`);
        next();
    } catch (error) {
        res.status(401).end();
    }
}

/**
 * สร้าง jwt strategy สำหรับ passport.js
 */
function passportJwtAuth() {

    // option บอกว่า decode token จากไหน และใช้ secret อะไร
    const opt: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"), // token จาก header
        secretOrKey: SECERT
    }

    const callback: VerifyCallback = function(payload, done) {
        // payload คือ payload จาก jwt token
        console.log(`[passportJwtAuth] [callback]: payload: ${JSON.stringify(payload)}`);

        // TODO: check user..

        // done(null, user);
        done(null, true);
    }

    return new Strategy(opt, callback);
}

/**
 * Ref: https://www.npmjs.com/package/express-basic-auth
 */

export default {
    basic,
    jwtAuth,
    passportJwtAuth
}