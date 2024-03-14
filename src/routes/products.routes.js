const userController=require('../controllers/user.Controller')
const {auth} = require('../middlewares/authentication')

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: './upload/images/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage }).array('files')

const router = require('express').Router()

// use routers
router.post('/addProduct',[auth], userController.addProduct)

router.post('/uploadimage/:id',[auth],upload, userController.uploadProduct)

router.get('/allProducts',[auth], userController.getAllProducts)

router.get('/getOne/:id', [auth],userController.getOneProduct)

// router.get('/pagnation/', [auth],userController.pagnation)

router.get('/sorting/', [auth],userController.sorting)

router.put('/updateProduct/:id',[auth],  userController.updateProduct)

router.delete('/deleteProduct/:id',[auth], userController.deleteProduct)


module.exports = router;