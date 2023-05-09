const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    console.log('req.headers', req.headers.authorization);
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, 'secret', function (err, decoded) {
            console.log('this a autherization token', err);
            if (decoded === undefined) {
                res.status(401).json({
                    message:  "please athentication"
                })
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({
            message: "Invalid token"
        })
    }
}
module.exports = {
    auth
}