//mysql

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Password_123",
    DB: "project",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    PORT:3000,
  };

//postgres

// module.exports = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "12345",
//   DB: "project",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   PORT: 3030,
// };