const router = require('express').Router();
const basicAuth = require('express-basic-auth');
const jwt = require('jsonwebtoken');
const express = require('express');
const auth = require('./auth');

router.post('/login', login);
router.get('/basic', basicAuth({ authorizer: auth.basic }), hello);
router.get('/jwt', auth.jwtAuth, hello);

/**
 * Simple response
 * @param {express.request} req 
 * @param {express.response} res 
 */
function hello(req, res) {
    res.json({ status: 'OK', message: "Hello World!" });
}

/**
 * Login and return JWT
 * @param {express.request} req 
 * @param {express.response} res 
 */
function login(req, res) {
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