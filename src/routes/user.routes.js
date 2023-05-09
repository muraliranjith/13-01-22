// import controllers review, products
const userController = require('../controllers/admin.Controller')

const { auth } = require('../middlewares/authentication')


// router

const router = require('express').Router()


router.post('/register', userController.addUser);

router.post('/login', userController.login);

router.post('/refreshToken', userController.refreshToken);

router.post('/resetPassword', userController.resetPassword);

router.post('/sendmsg', [auth], userController.message);

router.get('/getAllUser', [auth], userController.getAllUsers)

router.get('/fulltextsearch', [auth], userController.fullTextSearch)

router.get('/:id', [auth], userController.getOneUser)

router.put('/:id', [auth], userController.updateUser)

router.delete('/:id', [auth], userController.deleteUser)

module.exports = router;
