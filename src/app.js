const express = require('express')
const cors = require('cors')
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
