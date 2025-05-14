require("dotenv").config();
const express = require("express");
const { mainRoutes } = require("./modules");
const { ValidationError } = require("express-validation");
const { globalMessages } = require("./common/global.message");
const bodyParser = require("body-parser");
const app = express();
require("./config/sequelize.config");
require("./config/model.init");
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(mainRoutes);

app.use((req, res, next) => {
  return res
    .status(404)
    .json({ msg: globalMessages.notFoundRoute, statusCode: 404 });
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(err?.statusCode ?? 500).json({
    msg: err?.message ?? "Internal server error",
    statusCode: err?.statusCode ?? 500,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`app listen in port ${process.env.PORT}`);
});
