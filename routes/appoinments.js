const express = require("express");
const Router = express.Router();
const AppointmentController = require("../controllers/appointments");
const authorization = require("../middlewares/authorization");
const { PATIENT, PSIKIATER } = require("../constants/role");

Router.get("/patient", AppointmentController.getAppointmentDataByPatientId);

Router.get(
  "/time-schedule",
  AppointmentController.getAppointmentPsikiaterSchedule
);

Router.get(
  "/psikiater",
  authorization(PSIKIATER),
  AppointmentController.getAppointmentDataByPsikiaterId
);

Router.get(
  "/:appointment_id",
  AppointmentController.getOneAppointmentDataByAppointmentId
);

Router.patch(
  "/status/:id",
  AppointmentController.updateStatusAppointmentByIdPatient
);

Router.post(
  "/",
  authorization(PATIENT),
  AppointmentController.createAppointment
);

Router.patch(
  "/diagnose/:id",
  authorization(PSIKIATER),
  AppointmentController.updateDiagnose
);

module.exports = Router;
