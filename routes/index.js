const Router = require("express").Router();
const reviewRouter = require("./review");
const patientRouter = require("./patient");
const psikiaterRouter = require("./psikiater");
const authRoutes = require("./auth");
const scheduleRouter = require("./schedules");
const prescriptionRouter = require("./prescriptions");
const appointmentRouter = require("./appoinments");
const paymentRouter = require("./payments");
const verifyRouter = require("./verify");

const path = require("path");

const firebase = require("./firebase");
const adminRouter = require("./admins");

const authentication = require("../middlewares/authentication");
Router.use("/user", firebase);

Router.use("/auth", authRoutes);

Router.use("/psikiater", psikiaterRouter);

Router.use("/verify-user", verifyRouter);

Router.use("/admin", adminRouter);

Router.use(authentication);

Router.use("/payments", paymentRouter);

Router.use("/appointments", appointmentRouter);

Router.use("/reviews", reviewRouter);

Router.use("/patients", patientRouter);

Router.use("/schedule", scheduleRouter);

Router.use("/prescriptions", prescriptionRouter);

module.exports = Router;
