import { Router, Response, Request } from 'express';
import basicAuth from 'express-basic-auth';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import auth from './auth';

const router = Router();
const SECRET = "myKey";

passport.use(auth.passportJwtAuth()); // เรียก jwt strategy ที่ทำไว้

router.post('/login', login);
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

    // TODO : generate refresh token

    const token = jwt.sign(payload, SECRET, { expiresIn: 60 }); // ออก token
    res.json({ jwt: token });
}

module.exports = router;