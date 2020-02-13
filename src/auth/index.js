const express = require('express');
const jwt = require('jsonwebtoken');
const basicAuth = require('express-basic-auth');

function basic(username, password) {
    console.info(`[info] [basic auth] user: ${username}, pass: ${password}`);

    const userMatches = basicAuth.safeCompare(username, "basic");
    const passwordMatches = basicAuth.safeCompare(password, "test");
    return userMatches & passwordMatches;
}

/**
 * Auth with JWT
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {*} next 
 */
function jwtAuth(req, res, next) {
    const auth = req.headers.authorization;
    console.log(`[jwtAuth] ${auth}`);

    // ตรวจสอบ jwt token
    const SECERT = 'myKey';
    let payload;
    try {
        payload = jwt.verify(auth, SECERT);
        console.log(`[jwtAuth] ${JSON.stringify(payload)}`);
        next();
    } catch (error) {
        res.status(401).end();        
    }
}

/**
 * Ref: https://www.npmjs.com/package/express-basic-auth
 */

module.exports = {
    basic,
    jwtAuth
}