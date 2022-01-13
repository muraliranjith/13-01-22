const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fast2sms = require('fast-two-sms')
const User = db.admin;
const Token1 = db.token;


// 1. create User

const addUser = async (req, res) => {

    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    const user = await User.create(payload);
    res.status(200).send(user);
}

const login = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) throw err;
            // console.log(result);
            if (result) {
                jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" }, async (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({
                        message: "success",
                        token: result,
                    });
                    await Token1.create({ Token: result });

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
    let user = await User.findAll({});
    res.status(200).send(user);

}

// 3. get single User

const getOneUser = async (req, res) => {

    let id = req.body.id;
    let user = await User.findOne({ where: { id: id } });
    res.status(200).send(user);

}

// 4. update User

const updateUser = async (req, res) => {

    let id = req.body.id;

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

    console.log("11111111111111111111111",req.headers.authorization);
    var options = { authorization: req.headers.authorization, message: req.body.message, numbers:req.body.number }

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
    message

}