const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fast2sms = require('fast-two-sms')
const User = db.admin;
const Token1 = db.token;
const sequelize = require('sequelize')
const userService = require('../services/user.service')
// 1. create User

const addUser = async (req, res) => {
    const {firstName, lastName, email, password } = req.body;
    if (firstName, lastName, email, password) {     
        const payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        }
        const useremail = await User.findOne({ where: { email: email } });
        if (!useremail) {
            const user = await User.create(payload);
        res.status(200).send(user);

        } else {
            res.status(200).json({message: 'user already exist'});
        }
    } else {
        res.status(400).json({message: " please give all request"});
    }
}

const login = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) throw err;
            // console.log(result);
            if (result) {
                jwt.sign({ id: user.id, email: user.email }, "secret", { expiresIn: "1hr" }, async (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({
                        message: "success",
                        token: result,
                    });
                    var token = await Token1.findOne({ where: { userId: user.id } });
                    if (token) {
                        await Token1.update({ token: result }, { where: { userId: user.id } });
                    } else {
                        await Token1.create({ Token: result, userId: user.id });
                    }

                })
            } else {
                res.status(404).json({
                    message: "password wrong",
                });
            }

        });

    } else {
        res.status(401).json({
            message: "email not found",
        });
    }
}

const refreshToken = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = await Token1.findOne({ where: { token: req.headers.authorization } });
        if (token) {
            jwt.verify(`${req.headers.authorization}`, 'secret', async function (err, decoded) {
                if (decoded) {
                    res.status(200).json({
                        message: "valid Token",
                        token: token.dataValues.Token,
                    });
                } else {
                    var decod = jwt.decode(token.dataValues.Token);
                    if (token.dataValues) {
                        jwt.sign({ id: decod.id, email: decod.email }, "secret", { expiresIn: "1hr" }, async (err, result) => {
                            if (err) {
                                throw err;
                            }
                            await Token1.update({ Token: result }, { where: { id: token.dataValues.id } });
                            res.status(200).json({
                                message: "success",
                                token: result,
                            });
                        })
                    }
                }
            })
        } else {
            res.status(401).send('Check Your Authorization Token')
        }
    } else {
        res.status(401).send('unAutharized');
    }
}

const resetPassword = async (req, res) => {

    const user = await User.findOne({
        where: { email: req.body.email }
    })
    if (user) {
        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if (result) {
                const saltRounds = 10;
                bcrypt.hash(req.body.newpassword, saltRounds, async (err, hash) => {
                    if (err) throw err;
                    if (hash) {
                        await User.update({ password: hash }, { where: { email: req.body.email } });
                        res.status(200).json({
                            message: "password updated",
                            password: hash
                        })
                    } else {
                        res.status(401).json({
                            message: " updated failed",
                            newpassword: hash
                        })
                    }

                })
            } else {
                res.status(401).json({
                    message: "password is wrong",
                })
            }

        })
    }

};

// 2. get all data

const getAllUsers = async (req, res) => {
    console.log('decodedsssssssssssssss');
    let user = await User.findAll({});
    res.status(200).send(user);

}
const fullTextSearch = async (req, res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const user = await userService.queryFiles(firstName, lastName)
    res.status(200).send(user)

}
// 3. get single User

const getOneUser = async (req, res) => {

    let id = req.body.id;
    let user = await User.findOne({ where: { id: id } });
    res.status(200).send(user);

}

// 4. update User

const updateUser = async (req, res) => {

    let id = req.params.id;

    const user = await User.update(req.body, { where: { id: id } });

    res.status(200).send("sucess");


}

// 5. delete User by id

const deleteUser = async (req, res) => {

    let id = req.body.id;

    await User.destroy({ where: { id: id } });

    res.status(200).send('user is deleted !')

}
const message = async (req, res) => {

    var options = { authorization: req.headers.authorization, message: req.body.message, numbers: req.body.number }

    fast2sms.sendMessage(options)
}
module.exports = {
    addUser,
    login,
    resetPassword,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    message,
    fullTextSearch,
    refreshToken
}