const db = require('../models');
const productSrvice = require('../services/products.services')
const fs = require('fs')
const { pick, pickLike, pickGTE, pickLTE, pickEQ } = require('../utils/pick')


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

    const filter = pick(req.query, ['name', 'title', 'description', 'path', 'price', 'published']);
    let lteFilter = {};
    let gteFilter = {};
    let nameFilter = {};
    let nameFilter1 = {};
    let nameFilter2 = {};
    let nameFilter3 = {};
    let nameFilter4 = {};
    let nameFilter5 = {};

    if (req.body.fromDate && req.body.fromDate != '') {
        const data = pickGTE(req.body, ['fromDate']);
        gteFilter = { createdAt: data.fromDate }
    }
    if (req.body.toDate && req.body.toDate != '') {
        const data = pickLTE(req.body, ['toDate']);
        lteFilter = { updatedAt: data.toDate }
    }
    if (req.body.name && req.body.name != '' || req.body.title && req.body.title != '' || req.body.description && req.body.description != '' || req.body.path && req.body.path != '' || req.body.published && req.body.published != '') {
        const data = pickLike(req.body, ['name', 'title', 'description', 'path', 'price', 'published']);
        if (req.body.name) {
            nameFilter = { name: data.name }
        } else if (req.body.title) {
            nameFilter1 = { title: data.title }
        } else if (req.body.description) {
            nameFilter2 = { description: data.description }
        } else if (req.body.path) {
            nameFilter3 = { path: data.path }
        } else if (req.body.published) {
            nameFilter5 = { published: data.published }
        }
    }
    if (req.body.price && req.body.price != '') {
        const data = pickEQ(req.body, ['price']);
        nameFilter4 = { price: data.price }
    }
    const payload = { ...filter, ...gteFilter, ...lteFilter, ...nameFilter, ...nameFilter1, ...nameFilter2, ...nameFilter3, ...nameFilter4, ...nameFilter5 }
    const result = await productSrvice.queryFiles(payload);
    res.send(result)
}

// const pagnation = async (req, res) => {

//     const options = pick(req.body, ['limit', 'page']);
//     const result = await Product.findAndCountAll(options)
//     res.send(result)
// }
const sorting = async (req, res) => {

    const options = pick(req.body, ['limit', 'page']);
    const name = (req.body.name || req.body.title || req.body.description || req.body.path || req.body.published);
    const order = req.body.order;
    
    if (name || options) {

        if (name !== undefined) {
            const result = await Product.findAndCountAll({ order: [[`${name}`, `${order}`]] });
            res.send(result)
        } else if (options !== undefined) {
            const result = await Product.findAll(options)
            
            res.send(result)
        } else {
            res.status(400).send("Enter your Request")
        }

    }

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
    // pagnation,
    sorting
}