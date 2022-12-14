module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product", {
        name: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN
        },
        path: {
            type: DataTypes.STRING,
        },
    
    })

    return Product
    
}