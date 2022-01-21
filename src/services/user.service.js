const db = require('../models');
const sequelize = require('sequelize')


const User = db.admin;



const queryFiles = (async (firstName, lastName) => {
    
    const user = await  User.findAndCountAll({
        where: {
          [sequelize.Op.or]:{
           namesQuery: sequelize.where(
            sequelize.fn(
              "CONCAT",
              sequelize.col("firstName"),
              " ",
              sequelize.col("lastName")
            ),
          ),
          firstName: {[sequelize.Op.like]: `%${firstName}%`},
          lastName: {[sequelize.Op.like]: `%${lastName}%`},
        }
      }
      
    })
    return user;
})

module.exports={
    queryFiles,
}