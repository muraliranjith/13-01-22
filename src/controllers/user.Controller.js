const db = require('../models');
const productSrvice = require('../services/products.services')
const { base64encode, base64decode } = require('nodejs-base64');
const fs = require('fs')
const { pick, pickLike, pickGTE, pickLTE } = require('../utils/pick')


const Product = db.products;

const addProduct = async (req, res) => {

    let payload = {

        name: req.body.name,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,

    }
    const product = await productSrvice.addProducts(payload);
    res.status(200).send(product);
}
const uploadProduct = (req, res) => {
    req.files.map(async (item) => {
        const payload = {
            path: item.path,
        }
        const files = fs.readFileSync(`${payload.path}`, { encoding: "base64" });
        const id = req.params.id
        const decode = { decode: files, ...payload } //spread operater

        var product = await Product.update(decode, { where: { id: id } });

        res.status(200).json({
            message: "succesfully Product updated",
            data: product
        });
    })
}
const getAllProducts = async (req, res) => {

    const filter = pick(req.query, ['name', 'scanStatus', 'imageType', 'imageName']);
    let lteFilter = {};
    let gteFilter = {};
    let nameFilter = {};
    if (req.body.fromDate && req.body.fromDate != '') {
        const data = pickGTE(req.body, ['fromDate']);
        gteFilter = { createdAt: data.fromDate }
    }
    if (req.body.toDate && req.body.toDate != '') {
        const data = pickLTE(req.body, ['toDate']);
        lteFilter = { updatedAt: data.toDate }
    }
    if (req.body.name && req.body.name != '') {
        const data = pickLike(req.body, ['name']);
        nameFilter = { name: data.name }
        console.log(nameFilter);
    }
    const options = pick(req.body, ['limit', 'page']);
    const payload = { ...filter, ...gteFilter, ...lteFilter, ...nameFilter }
    console.log(options);
    const result = await productSrvice.queryFiles(payload);
    res.send(result)
}

const pagnation = async (req, res) => {

    const options = pick(req.body, ['limit', 'page']);
    const result = await Product.findAndCountAll(options)
    res.send(result)
}
const getOneProduct = async (req, res) => {

    let id = req.body.id;
    let product = await productSrvice.getOneProduct(id)
    res.status(200).send(product);

}

const updateProduct = async (req, res) => {

    let id = req.params.id;

    const product = await productSrvice.updateProduct(req.body, { where: { id: id } })

    res.status(200).send("product updated");

}
const deleteProduct = async (req, res) => {

    let id = req.body.id;

    await Product.destroy({ where: { id: id } });

    res.status(200).send('Product is deleted !')
}

module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    uploadProduct,
    pagnation
}