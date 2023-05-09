const { app } = require('./app')
const config = require('./config/config')
const product = require('./routes/products.routes')
const user = require('./routes/user.routes')


app.use('/api/v1/', user);
app.use('/api/v1/products', product);

//test

app.get('/', (req, res) => {

    res.send('Hello world')
});

app.listen(config.PORT, () => {
    console.log(`server is running port ${config.PORT}`);
})
