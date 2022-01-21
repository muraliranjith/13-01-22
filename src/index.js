const express = require('express')
const cors = require('cors')
const app = express();
const config = require('./config/config')
const product =require('./routes/products.routes')
const user = require('./routes/user.routes')


var corOptions = {
    origin: 'http://localhost:3000'
}
//middlewares

app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth/', user);
app.use('/api/products', product);

//test

app.get('/', (req, res) => {

    res.send( 'Hello world' )
});

app.listen(config.PORT, () => {
    console.log(`server is running port ${config.PORT}`);
})