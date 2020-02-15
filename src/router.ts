import { Router, Response, Request } from 'express';
import basicAuth from 'express-basic-auth';
import jwt from 'jsonwebtoken';
import auth from './auth';

const router = Router();

router.post('/login', login);
router.get('/basic', basicAuth({ authorizer: auth.basic }), hello);
router.get('/jwt', auth.jwtAuth, hello);

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

    const SECRET = "myKey";
    const payload = {
        sub: username
    }

    const token = jwt.sign(payload, SECRET); // ออก token
    res.json({ jwt: token });
}

module.exports = router;