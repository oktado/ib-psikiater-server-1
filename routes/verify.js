const express = require("express");
const Router = express.Router();
const verifyController = require("../controllers/verify");

Router.get("/request-new/:token", verifyController.sendNewLink);
Router.get("/verify/:token", verifyController.verifyUser);

module.exports = Router;
