const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    if (req.headers.authorization) {

        jwt.verify(req.headers.authorization, 'secret', function (err, decoded) {

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
            message: "please athentication"
        })
    }
}
module.exports = {
    auth
}