const dbConfig = require('../config/config');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)
sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.products = require('./products.model')(sequelize, DataTypes);
db.admin = require('./user.models')(sequelize, DataTypes);
db.token = require('./token.models')(sequelize, DataTypes);


db.sequelize.sync({ force: false })
.then(() => {
    console.log(`yes re-sync done! \nlisten port : http://localhost:${dbConfig.PORT}`);
});
module.exports = db;