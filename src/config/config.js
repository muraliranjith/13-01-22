//mysql

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "SmartWork@123",
    DB: "project",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    PORT:4040,
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