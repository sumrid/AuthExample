import { Router, Response, Request } from 'express';
import basicAuth from 'express-basic-auth';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import auth from './auth';

const router = Router();
const SECRET = "myKey";
const REFRESH_SECRET = "refreshTokenSecert";
const refreshTokens: any = {};

passport.use(auth.passportJwtAuth()); // เรียก jwt strategy ที่ทำไว้

router.post('/login', login);
router.post('/token', issueToken);
router.get('/tokens', getTokens);
router.get('/basic', basicAuth({ authorizer: auth.basic }), hello);

router.get('/jwt', auth.jwtAuth, hello);
router.get('/jwt/passport', passport.authenticate("jwt", { session: false }), hello); // auth with passport.js

function hello(req: Request, res: Response) {
    res.json({ status: 'OK', message: "Hello World!" });
}

function login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    if (username !== "user1" || password !== "pass1") {
        res.status(404).end();
        return;
    }

    const payload = {
        sub: username
    }

    // ออก token
    const token = jwt.sign(payload, SECRET, { expiresIn: 60 });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "15d" });
    refreshTokens[refreshToken] = username;

    res.json({ jwt: token, refreshToken });
}

/**
 * ขอ access token ใหม่
 * @param req 
 * @param res 
 */
function issueToken(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;
    const username = req.body.username;

    // check refresh token
    if (!(refreshToken in refreshTokens)) {
        return res.status(401).send("token invalid.");
    }

    const payload = {
        sub: username
    }
    const token = jwt.sign(payload, SECRET, { expiresIn: 60 });
    res.json({ jwt: token });
}

function getTokens(req: Request, res: Response) {
    res.json(refreshTokens);
}

module.exports = router;