const express = require('express')
const cors = require('cors');
// const red = require('../src/middlewares/redisClient');
const app = express();

var corOptions = {
    origin: '*'
}
//middlewares

app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

module.exports = {
    app
}
