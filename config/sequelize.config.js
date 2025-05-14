const { Sequelize, cast } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
});
sequelize
  .authenticate()
  .then(console.log("Connected to database successfully."))
  .catch((err) => {
    console.log("DB ERROR: ", err);
  });

module.exports = { sequelize };
