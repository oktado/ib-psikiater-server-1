const express = require("express");
const Router = express.Router();
const AdminController = require("../controllers/admins");

Router.patch("/payment-approval", AdminController.paymentApproval);
Router.post("/create-admin", AdminController.createAdmin);
module.exports = Router;
