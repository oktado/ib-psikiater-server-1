const express = require("express");
const Router = express.Router();
const AdminController = require("../controllers/admins");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../constants/role");

Router.post("/create-admin", AdminController.createAdmin);

Router.use(authentication);
Router.use(authorization(ADMIN));

Router.post("/payment-approval", AdminController.paymentApproval);
Router.post("/psychiatrist-approval", AdminController.approvalPsikiater);
Router.get("/admin/:admin_id", AdminController.getOneAdminById);

module.exports = Router;
