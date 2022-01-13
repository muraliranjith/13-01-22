const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [7, 80], 
        },
      },
    },
    {
      timestamps: false,
    }
  );

  user.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  user.beforeUpdate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  user.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };
  user.prototype.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return user;
};