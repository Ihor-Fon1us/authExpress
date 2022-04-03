const jsonwebtoken = require('jsonwebtoken');
const conf = require('../bin/config/config');   

function loginService() {
    return async (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) {
            req.user = undefined;
            next();
        } else {
            try {
                const decode = await jsonwebtoken.verify(token, conf.costJWT);
                req.user = decode;
                next();
            } catch (error) {
                req.user = undefined;
                next();
            }
        }
    };
}

module.exports.loginService = loginService