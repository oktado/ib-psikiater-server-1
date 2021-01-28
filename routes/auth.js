const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/auth");
const authentication = require("../middlewares/authentication");

Router.post("/register-patient", AuthController.registerPatient);
Router.post("/register-psikiater", AuthController.registerPsikiater);
Router.post("/login", AuthController.login);

Router.get("/identifer", authentication, AuthController.userIdentifier);
module.exports = Router;
